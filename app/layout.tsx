import type { Metadata } from "next";
import { Playfair_Display, Nunito_Sans, Cairo } from "next/font/google";
import { LangProvider } from "@/lib/lang-context";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const nunito = Nunito_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-nunito", display: "swap" });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "500"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: "Nawah — نواة | Pregnancy Companion",
  description: "The Arabic pregnancy companion app for mothers and fathers. Built for GCC and Egypt.",
  openGraph: {
    title: "Nawah — نواة",
    description: "Become each other's center. كونوا مركز بعضكم.",
    url: "https://nawah.vercel.app",
    siteName: "Nawah",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${nunito.variable} ${cairo.variable}`}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
