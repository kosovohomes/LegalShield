import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChromeNav as MarketingNav } from "@/components/marketing-chrome";
import { ChromeFooter as SiteFooter } from "@/components/marketing-chrome";
import { PageHero, PillarList, MarketingShell } from "@/components/marketing-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCheck, IconSparkles } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
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

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("pricing");
  const tiers = t.raw("tiers") as Array<{
    name: string;
    price: string;
    currency: string;
    period: string;
    tagline: string;
    features: string[];
    cta: string;
    highlight?: boolean;
  }>;

  return (
    <>
      <MarketingNav items={NAV} />
      <main>
        <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <MarketingShell withCta={false}>
          <section className="grid gap-4 md:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={cn(
                  "relative flex flex-col p-6",
                  tier.highlight && "border-primary/40 ring-1 ring-primary/20",
                )}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 start-6 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                    <IconSparkles size={10} />
                    recommended
                  </span>
                )}
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{tier.name}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight tabular-nums">
                      {tier.price === "—" ? tier.price : tier.price}
                    </span>
                    {tier.price !== "—" && tier.currency && (
                      <span className="text-sm text-muted-foreground">{tier.currency}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{tier.period}</div>
                  <p className="mt-3 text-sm text-muted-foreground">{tier.tagline}</p>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <IconCheck size={14} className="mt-0.5 shrink-0 text-primary" />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={tier.highlight ? "default" : "outline"}
                  className="mt-6 w-full"
                >
                  <a href={tier.cta === "Browse lawyers" ? `/${locale}/lawyer-review` : `/${locale}/cases/new`}>
                    {tier.cta}
                  </a>
                </Button>
              </Card>
            ))}
          </section>

          <Card className="mt-12 p-6 text-sm text-muted-foreground">
            <strong className="text-foreground">Note.</strong> {t("noCommission")}
          </Card>
        </MarketingShell>
      </main>
      <SiteFooter />
    </>
  );
}
