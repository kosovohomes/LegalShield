import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LegalShield",
  description: "Client evidence and transparency workspace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Per next-intl setup, <html>/<body> are rendered by app/[locale]/layout.tsx
  // so lang/dir follow the active locale (ar = RTL, en = LTR).
  return children;
}
