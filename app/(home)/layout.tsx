import { SiteShell, siteMetadata } from "@/components/SiteShell";

// The home page: Arabic first, server-rendered as <html lang="ar" dir="rtl"> (owner 2026-11-06). EN via the switch.
export const metadata = siteMetadata;

export default function HomeRootLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="ar">{children}</SiteShell>;
}
