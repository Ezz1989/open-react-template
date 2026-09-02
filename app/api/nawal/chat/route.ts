import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Groq decommissioned llama-3.1-8b-instant in its 2026-06-17 sweep (the same
// round that killed llama-3.3-70b-versatile in the main app's ai-chat
// function). A hardcoded model id is a dated assumption, so this resolves
// against Groq's live /models list instead, same fix as ai-chat/models.ts.
const GROQ_MODELS_URL = "https://api.groq.com/openai/v1/models";
const PREFERRED_MODELS = [
  "openai/gpt-oss-120b",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-20b",
] as const;

function parseModelIds(payload: unknown): string[] {
  const data = (payload as { data?: unknown })?.data;
  if (!Array.isArray(data)) return [];
  return data
    .map((entry) => (entry as { id?: unknown })?.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
}

function pickModel(preferred: readonly string[], available: readonly string[]): string | null {
  const served = new Set(available);
  for (const candidate of preferred) {
    if (served.has(candidate)) return candidate;
  }
  return null;
}

function isModelGone(status: number, body: string): boolean {
  if (status !== 404 && status !== 400) return false;
  const haystack = body.toLowerCase();
  return (
    haystack.includes("model_not_found") ||
    haystack.includes("does not exist") ||
    haystack.includes("decommissioned")
  );
}

let resolvedModel: string | null = null;

async function resolveModel(apiKey: string): Promise<string | null> {
  if (resolvedModel) return resolvedModel;

  let available: string[];
  try {
    const response = await fetch(GROQ_MODELS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) {
      console.error("groq model list http", response.status);
      return null;
    }
    available = parseModelIds(await response.json());
  } catch (e) {
    console.error("groq model list unreachable", String(e));
    return null;
  }

  const picked = pickModel(PREFERRED_MODELS, available);
  if (!picked) {
    console.error(
      `groq serves none of ${PREFERRED_MODELS.join(", ")} — it offers`,
      available.join(", "),
    );
    return null;
  }

  console.log("groq resolved model", picked);
  resolvedModel = picked;
  return picked;
}

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);
  if (!record || record.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= LIMIT) return false;
  record.count += 1;
  return true;
}

function buildSystemPrompt(role: "mother" | "father", lang: "en" | "ar"): string {
  const base =
    lang === "ar"
      ? `أنت "نوال" — رفيقة حمل دافئة ومطّلعة، مدمجة في تطبيق نواة. تحدّثي كصديقة مقرّبة تعرف كل ما يتعلّق بالحمل وصحّة الأم والأبوّة. كوني متعاطفة، مُطمئنة، عملية، وغير باردة أو طبّية بحتة.`
      : `You are "Nawal" — a warm, knowledgeable pregnancy companion built into the Nawah app. Speak like a trusted best friend who happens to know everything about pregnancy, maternal health, and parenting. Be empathetic, reassuring, practical, never clinical.`;

  const roleBlock =
    role === "father"
      ? lang === "ar"
        ? `أنت تتحدّثين مع الأب / الشريك، وليس مع الأم الحامل. خاطبيه كشريك داعم. ركّزي على كيف يدعم ويفهم ويتواصل مع شريكته. لا تقولي "حملك" له.`
        : `You are speaking with the FATHER / partner, not the pregnant mother. Address him as a supportive partner. Focus on how he can support, understand, and connect with his partner. Never say "you're pregnant".`
      : lang === "ar"
        ? `أنتِ تتحدّثين مع الأم الحامل مباشرةً. خاطبيها بدفء. هذه صفحة ترحيب — لا تعرفين بعد أسبوع حملها، فاسألي إن لزم.`
        : `You are speaking with the MOTHER who is pregnant. Address her warmly. This is a landing page — you don't know her week yet, ask naturally if relevant.`;

  const guidelines =
    lang === "ar"
      ? `- اختصري: ٢-٤ جمل ما لم تُطلب تفاصيل.
- لا تُشخّصي ولا تصفي دواءً.
- لأيّ عرَض مقلق أنهي بـ "يستحقّ أن تذكريه للطبيب."
- للحالات الطارئة (نزيف شديد، ألم حادّ، توقّف حركة الجنين) قولي فوراً "اذهبي إلى المستشفى الآن — لا تنتظري."
- اعترفي بالمشاعر قبل إعطاء المعلومة.`
      : `- Be concise: 2-4 sentences unless asked for detail.
- Never diagnose or prescribe.
- For any concerning symptom, end with: "It's worth mentioning this to a doctor."
- For emergencies (heavy bleeding, severe pain, no fetal movement), say immediately: "Please go to the hospital right away — don't wait."
- Acknowledge emotions before giving information.`;

  return `${base}\n\n${roleBlock}\n\n${guidelines}`;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  role?: "mother" | "father";
  lang?: "en" | "ar";
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const apiKey = process.env.GROQ_API_KEY_LANDING;
  if (!apiKey) {
    console.error("GROQ_API_KEY_LANDING not set");
    return NextResponse.json({ error: "upstream_error" }, { status: 500 });
  }

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const role = body.role === "father" ? "father" : "mother";
  const lang = body.lang === "ar" ? "ar" : "en";
  const history = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  const messages = [{ role: "system", content: buildSystemPrompt(role, lang) }, ...history];

  if (!(await resolveModel(apiKey))) {
    return NextResponse.json({ error: "upstream_error" }, { status: 500 });
  }

  const callGroq = () =>
    fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: resolvedModel,
        messages,
        temperature: 0.7,
        max_tokens: 384,
      }),
    });

  let groqRes = await callGroq();

  if (!groqRes.ok) {
    const detail = await groqRes.text().catch(() => "");
    // Same guarded retry as ai-chat: re-resolve once if the cached id has
    // been decommissioned under us, otherwise the failure is something else
    // (quota, auth) that re-resolving cannot fix.
    if (isModelGone(groqRes.status, detail)) {
      console.log(`groq model ${resolvedModel} is gone; re-resolving`);
      resolvedModel = null;
      const retryModel = await resolveModel(apiKey);
      if (retryModel) {
        groqRes = await callGroq();
      }
    }
    if (!groqRes.ok) {
      const retryDetail = await groqRes.text().catch(() => detail);
      console.error("Groq error", groqRes.status, retryDetail);
      return NextResponse.json({ error: "upstream_error" }, { status: 502 });
    }
  }

  const data = await groqRes.json();
  const reply = data?.choices?.[0]?.message?.content?.trim() ?? "";
  return NextResponse.json({ reply });
}
