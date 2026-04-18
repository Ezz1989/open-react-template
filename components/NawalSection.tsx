"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang-context";
import { useMode } from "@/lib/mode-context";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.nawahapp";

type Msg = { who: "me" | "ai"; text: string };

function pickFallback(text: string, replies: Record<string, string>): string {
  const lower = text.toLowerCase();
  if (/hear|sense|اسمع|تسمع/.test(lower)) return replies.hear;
  if (/tired|تعب|مرهق/.test(lower)) return replies.tired;
  if (/partner|husband|شريك|زوج/.test(lower)) return replies.partner;
  return replies.default;
}

export function NawalSection() {
  const { t, lang } = useLang();
  const { mode } = useMode();
  const greeting = t("nawal.greeting") as string;
  const [messages, setMessages] = useState<Msg[]>([{ who: "ai", text: greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([{ who: "ai", text: greeting }]);
    setUserMsgCount(0);
  }, [greeting]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { who: "me", text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setUserMsgCount((c) => c + 1);

    const fallback = t("nawal.fallbackReplies") as Record<string, string>;
    try {
      const res = await fetch("/api/nawal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.who === "me" ? "user" : "assistant",
            content: m.text,
          })),
          role: mode,
          lang,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const reply = (data?.reply as string) || pickFallback(text, fallback);
      setMessages((m) => [...m, { who: "ai", text: reply }]);
    } catch {
      setMessages((m) => [...m, { who: "ai", text: pickFallback(text, fallback) }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = t("nawal.suggestions") as readonly string[];
  const eyebrow = t("nawal.eyebrow") as string;
  const headlineA = t("nawal.headlineA") as string;
  const headlineB = t("nawal.headlineB") as string;
  const sub = t("nawal.sub") as string;
  const tryLabel = t("nawal.tryLabel") as string;
  const thinking = t("nawal.thinking") as string;
  const inputPlaceholder = t("nawal.inputPlaceholder") as string;
  const continueCta = t("nawal.continueCta") as string;

  return (
    <section id="nawal" style={{ background: "var(--bg-inv)", color: "#fff", borderRadius: 0 }}>
      <div
        className="container"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}
      >
        <div>
          <div className="eyebrow" style={{ color: "rgba(255,255,255,0.5)" }}>
            {eyebrow}
          </div>
          <h2 className="display-lg" style={{ marginTop: 18, color: "#fff" }}>
            {headlineA}
            <br />
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{headlineB}</em>
          </h2>
          <p style={{ marginTop: 24, fontSize: 17, opacity: 0.75, maxWidth: 480 }}>{sub}</p>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 12,
              alignItems: "center",
              fontSize: 13,
              opacity: 0.65,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
              }}
            >
              N
            </div>
            {tryLabel}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 28,
            padding: 24,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingBottom: 16,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 20,
              }}
            >
              N
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>
                Nawal{" "}
                <span
                  style={{
                    fontSize: 10,
                    background: "var(--accent)",
                    padding: "2px 7px",
                    borderRadius: 999,
                    marginLeft: 6,
                  }}
                >
                  AI
                </span>
              </div>
            </div>
          </div>
          <div
            ref={scroller}
            style={{
              maxHeight: 300,
              minHeight: 260,
              overflowY: "auto",
              padding: "16px 0",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.who === "me" ? "flex-end" : "flex-start",
                  background: m.who === "me" ? "var(--accent)" : "rgba(255,255,255,0.08)",
                  color: m.who === "me" ? "var(--accent-ink)" : "#fff",
                  padding: "10px 14px",
                  borderRadius: 16,
                  fontSize: 14,
                  maxWidth: "85%",
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  opacity: 0.6,
                  fontSize: 13,
                  padding: "6px 14px",
                }}
              >
                {thinking}
              </div>
            )}
          </div>
          {userMsgCount >= 3 && (
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                background: "var(--accent)",
                color: "var(--accent-ink)",
                padding: "10px 14px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 500,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {continueCta}
            </a>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  fontSize: 12,
                  padding: "6px 10px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 999,
                  color: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                }}
              >
                {s} →
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            style={{
              display: "flex",
              gap: 8,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 999,
              padding: 4,
              paddingLeft: 16,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: 14,
                padding: "8px 0",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "var(--accent-ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              ↑
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          #nawal .container { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

export default NawalSection;
