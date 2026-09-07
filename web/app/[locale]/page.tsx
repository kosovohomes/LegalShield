import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarketingNav } from "@/components/marketing-nav";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { FlowSection } from "@/components/flow-section";
import { SecuritySection } from "@/components/security-section";
import { CtaSection } from "@/components/cta-section";
import type { Locale } from "@/i18n/routing";

const NAV = [
  { href: "how", label: "How it works" },
  { href: "security", label: "Security" },
  { href: "verification", label: "Verification" },
  { href: "lawyer-review", label: "Lawyer review" },
  { href: "pricing", label: "Pricing" },
  { href: "about", label: "About" },
];

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  await getTranslations();

  return (
    <>
      <MarketingNav items={NAV} />
      <main>
        <Hero locale={locale} />
        <FlowSection />
        <SecuritySection locale={locale} />
        <CtaSection locale={locale} />
      </main>
      <SiteFooter />
    </>
  );
}
