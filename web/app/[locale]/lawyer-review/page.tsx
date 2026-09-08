import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChromeNav as MarketingNav } from "@/components/marketing-chrome";
import { ChromeFooter as SiteFooter } from "@/components/marketing-chrome";
import { PageHero, PillarList, MarketingShell } from "@/components/marketing-shell";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { IconUsers, IconBook, IconX, IconCheck } from "@/components/ui/icons";
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

export default async function LawyerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("lawyer");
  const items = t.raw("package.items") as string[];
  const vetting = t.raw("vetting.items") as string[];
  const noPromises = t.raw("noPromises.items") as string[];

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
          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <IconBook size={18} />
                </span>
                <h2 className="text-lg font-semibold tracking-tight">{t("package.title")}</h2>
              </div>
              <div className="mt-4">
                <PillarList items={items} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <IconUsers size={18} />
                </span>
                <h2 className="text-lg font-semibold tracking-tight">{t("vetting.title")}</h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t("vetting.body")}</p>
              <div className="mt-4">
                <PillarList items={vetting} />
              </div>
            </Card>
          </section>

          <section className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight">{t("noPromises.title")}</h2>
            <Card className="mt-4 p-6">
              <ul className="grid gap-3 sm:grid-cols-2">
                {noPromises.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-3 text-sm"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                      <IconX size={12} />
                    </span>
                    <span className="text-foreground/90">{p}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Disclaimer tone="info" className="mt-6">
              Referral commissions, fee splitting, contingency arrangements, and advertising
              practices are reviewed and approved for each jurisdiction before launch.
            </Disclaimer>
          </section>
        </MarketingShell>
      </main>
      <SiteFooter />
    </>
  );
}
