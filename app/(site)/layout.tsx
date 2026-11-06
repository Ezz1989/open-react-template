import { SiteShell, siteMetadata } from "@/components/SiteShell";

// Privacy, terms, support, delete-account, reset-password: English first (store reviewers open these).
export const metadata = siteMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
