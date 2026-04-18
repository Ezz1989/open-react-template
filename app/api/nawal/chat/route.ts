import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

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

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: buildSystemPrompt(role, lang) },
        ...history,
      ],
      temperature: 0.7,
      max_tokens: 384,
    }),
  });

  if (!groqRes.ok) {
    const detail = await groqRes.text().catch(() => "");
    console.error("Groq error", groqRes.status, detail);
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }

  const data = await groqRes.json();
  const reply = data?.choices?.[0]?.message?.content?.trim() ?? "";
  return NextResponse.json({ reply });
}
