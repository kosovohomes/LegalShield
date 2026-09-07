import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarketingNav } from "@/components/marketing-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHero, PillarList, MarketingShell } from "@/components/marketing-shell";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { IconShield, IconUsers, IconCompass, IconDownload, IconBook } from "@/components/ui/icons";
import type { Locale } from "@/i18n/routing";

const NAV = [
  { href: "how", label: "How it works" },
  { href: "security", label: "Security" },
  { href: "verification", label: "Verification" },
  { href: "lawyer-review", label: "Lawyer review" },
  { href: "pricing", label: "Pricing" },
  { href: "about", label: "About" },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("about");
  const values = t.raw("values") as Array<{ title: string; body: string }>;
  const icons = [IconUsers, IconShield, IconCompass, IconDownload, IconBook];

  return (
    <>
      <MarketingNav items={NAV} />
      <main>
        <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("intro")} />

        <MarketingShell withCta={false}>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Our values</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {values.map((v, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <Card key={v.title} className="p-6">
                    <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold tracking-tight">{v.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{v.body}</p>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-base font-semibold tracking-tight">Where we operate</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Kuwait (KW) and Jordan (JO) at launch. Each jurisdiction is gated on local legal
                review — product scope, marketing, and referral/payment models are reviewed before
                we onboard users there.
              </p>
              <Disclaimer tone="info" className="mt-4">
                LegalShield is a product specification. The publicly launched configuration in any
                jurisdiction is approved by qualified local counsel.
              </Disclaimer>
            </Card>
            <Card className="p-6">
              <h3 className="text-base font-semibold tracking-tight">Press &amp; investors</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                For press, partnerships, and investor relations, contact us.
              </p>
              <a
                href={`/${locale}/contact`}
                className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Contact page →
              </a>
            </Card>
          </section>
        </MarketingShell>
      </main>
      <SiteFooter />
    </>
  );
}
