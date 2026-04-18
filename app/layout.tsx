import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans, Noto_Naskh_Arabic } from "next/font/google";
import { LangProvider } from "@/lib/lang-context";
import "./globals.css";

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
const notoArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-naskh-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nawah — نواة | Pregnancy Companion",
  description: "The Arabic pregnancy companion app for mothers and fathers. Built for GCC and Egypt.",
  openGraph: {
    title: "Nawah — نواة",
    description: "Become each other's center. كونوا مركز بعضكم.",
    url: "https://babynawah.vercel.app",
    siteName: "Nawah",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrument.variable} ${plusJakarta.variable} ${notoArabic.variable}`}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
