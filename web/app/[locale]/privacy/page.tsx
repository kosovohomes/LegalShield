import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarketingNav } from "@/components/marketing-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero, MarketingShell } from "@/components/marketing-shell";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import type { Locale } from "@/i18n/routing";

const NAV = [
  { href: "how", label: "How it works" },
  { href: "security", label: "Security" },
  { href: "verification", label: "Verification" },
  { href: "lawyer-review", label: "Lawyer review" },
  { href: "pricing", label: "Pricing" },
  { href: "about", label: "About" },
];

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("legal.privacy");
  const sections = t.raw("sections") as Array<{ heading: string; body: string }>;

  return (
    <>
      <MarketingNav items={NAV} />
      <main>
        <PageHero eyebrow={t("eyebrow")} title={t("title")} />
        <MarketingShell withCta={false}>
          <Disclaimer tone="warning">
            <strong className="text-foreground">{t("lastUpdated")}:</strong>{" "}
            <span className="text-muted-foreground">This page is a product specification. The legally binding text is the Privacy Policy in your account and on file with our counsel.</span>
          </Disclaimer>

          <Card className="mt-8 p-6 sm:p-8">
            <p className="text-sm text-muted-foreground">{t("intro")}</p>
            <div className="mt-6 space-y-6">
              {sections.map((s) => (
                <section key={s.heading}>
                  <h2 className="text-base font-semibold tracking-tight">{s.heading}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </section>
              ))}
            </div>
          </Card>
        </MarketingShell>
      </main>
      <SiteFooter />
    </>
  );
}
