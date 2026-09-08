import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChromeNav as MarketingNav } from "@/components/marketing-chrome";
import { ChromeFooter as SiteFooter } from "@/components/marketing-chrome";
import { PageHero, MarketingShell } from "@/components/marketing-shell";
import { RightsHub } from "@/components/rights-hub";
import { rightsOrder, rightsByCountry } from "@/lib/rights";
import type { Locale } from "@/i18n/routing";

const NAV = [
  { href: "how", label: "How it works" },
  { href: "security", label: "Security" },
  { href: "verification", label: "Verification" },
  { href: "lawyer-review", label: "Lawyer review" },
  { href: "rights", label: "Client rights" },
  { href: "pricing", label: "Pricing" },
  { href: "about", label: "About" },
];

export default async function RightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("rights");

  return (
    <>
      <MarketingNav items={NAV} />
      <main>
        <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <MarketingShell withCta={false}>
          <RightsHub data={rightsOrder.map((c) => rightsByCountry(c))} defaultCountry="KW" />
        </MarketingShell>
      </main>
      <SiteFooter />
    </>
  );
}