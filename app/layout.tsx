import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nawah — Pregnancy Companion نواة",
  description: "Your Arabic pregnancy companion. Become each other's center.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
