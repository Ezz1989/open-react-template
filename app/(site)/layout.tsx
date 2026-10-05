import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans, Tajawal } from "next/font/google";
import { LangProvider } from "@/lib/lang-context";
import { ModeProvider } from "@/lib/mode-context";
import { PostHogProvider } from "@/components/PostHogProvider";
import "../globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});
// Tajawal = the brand's Arabic face (docs/BRAND_2026-09.md), same as the app.
// Replaced Noto Naskh 2026-10-06 (user picked option 1 of 4).
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

// Canonical host. babynawah.vercel.app still resolves and MUST keep working —
// the shipped Android build hardcodes it as the password-reset redirect — but
// nawahapp.net is the public-facing domain used on the Play listing.
const SITE_URL = "https://www.nawahapp.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nawah — نواة | Pregnancy Companion",
  description: "The Arabic pregnancy companion app for mothers and fathers. Built for GCC and Egypt.",
  openGraph: {
    title: "Nawah — نواة",
    description: "Neither of you is doing this alone. مش لوحدك في الحكاية دي.",
    url: SITE_URL,
    siteName: "Nawah",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Font variables go on <html>, not <body>: the :root tokens in globals.css
  // (--font-display, --font-arabic) reference them, and a variable set on
  // <body> is invisible to :root — every font silently fell back (fixed 2026-10-06).
  return (
    <html lang="en" suppressHydrationWarning className={`${instrument.variable} ${plusJakarta.variable} ${tajawal.variable}`}>
      <body>
        <PostHogProvider>
          <ModeProvider>
            <LangProvider>{children}</LangProvider>
          </ModeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
