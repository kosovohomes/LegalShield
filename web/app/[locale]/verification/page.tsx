import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChromeNav as MarketingNav } from "@/components/marketing-chrome";
import { ChromeFooter as SiteFooter } from "@/components/marketing-chrome";
import { PageHero, MarketingShell } from "@/components/marketing-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { IconCompass, IconCheck } from "@/components/ui/icons";
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

export default async function VerificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("verification");
  const refusal = t.raw("refusal.steps") as string[];
  const guides = t.raw("guides") as Record<
    string,
    Array<{ title: string; authority: string; verified: string }>
  >;

  return (
    <>
      <MarketingNav items={NAV} />
      <main>
        <PageHero
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <MarketingShell withCta={false}>
          <Disclaimer tone="info">
            <strong className="text-foreground">{t("noFees")}</strong>{" "}
            <span className="text-muted-foreground">{t("noGuarantee")}</span>
          </Disclaimer>

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            {(["KW", "JO"] as const).map((j) => (
              <div key={j}>
                <div className="mb-4 flex items-center gap-2">
                  <Badge tone="observation">{j}</Badge>
                  <h2 className="text-lg font-semibold tracking-tight">
                    {j === "KW" ? "Kuwait" : "Jordan"}
                  </h2>
                </div>
                <div className="grid gap-3">
                  {guides[j].map((g) => (
                    <Card key={g.title} className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-muted-foreground">
                            {g.authority}
                          </div>
                          <h3 className="mt-1 text-sm font-semibold tracking-tight">
                            {g.title}
                          </h3>
                        </div>
                        <IconCompass size={18} className="text-primary" />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge
                          tone={g.verified.includes("Pending") ? "warning" : "verified"}
                        >
                          {g.verified}
                        </Badge>
                        <a
                          href="#"
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Open guide →
                        </a>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="mt-20">
            <h2 className="text-2xl font-semibold tracking-tight">{t("refusal.title")}</h2>
            <Card className="mt-4 p-6">
              <ol className="space-y-3 text-sm">
                {refusal.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-medium text-primary ring-1 ring-primary/20">
                      {i + 1}
                    </span>
                    <span className="text-foreground/90">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        </MarketingShell>
      </main>
      <SiteFooter />
    </>
  );
}
