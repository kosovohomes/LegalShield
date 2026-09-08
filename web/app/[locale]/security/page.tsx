import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChromeNav as MarketingNav } from "@/components/marketing-chrome";
import { ChromeFooter as SiteFooter } from "@/components/marketing-chrome";
import {
  PageHero,
  PillarList,
  ValueGrid,
  MarketingShell,
} from "@/components/marketing-shell";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { IconLock, IconShield, IconKey, IconCheck, IconX } from "@/components/ui/icons";
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

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("security");
  const modelItems = t.raw("model.items") as Array<{ label: string; body: string }>;
  const modelIcons = [IconKey, IconLock, IconShield, IconCheck];
  const noClaim = t.raw("boundaries.items") as string[];

  return (
    <>
      <MarketingNav items={NAV} />
      <main>
        <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <MarketingShell withCta={false}>
          <section>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {t("model.eyebrow")}
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {t("model.title")}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{t("model.subtitle")}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {modelItems.map((item, i) => {
                const Icon = modelIcons[i % modelIcons.length];
                return (
                  <Card key={item.label} className="p-6">
                    <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold tracking-tight">
                      {item.label}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="mt-20 grid items-start gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{t("boundaries.title")}</h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                We never market a security guarantee that we cannot technically back. If we ever do
                claim a stronger property, it will be after an independent review.
              </p>
            </div>
            <Card className="p-6">
              <ul className="space-y-3">
                {noClaim.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                      <IconX size={12} />
                    </span>
                    <span className="text-foreground/90">{line}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section className="mt-16">
            <Disclaimer tone="warning">
              Encryption is necessary, not sufficient. We also run row-level security on every
              table, private storage with short-lived signed URLs, and append-only integrity logs
              you can review at any time.
            </Disclaimer>
          </section>
        </MarketingShell>
      </main>
      <SiteFooter />
    </>
  );
}
