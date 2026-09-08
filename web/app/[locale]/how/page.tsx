import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChromeNav as MarketingNav } from "@/components/marketing-chrome";
import { ChromeFooter as SiteFooter } from "@/components/marketing-chrome";
import {
  PageHero,
  ValueGrid,
  PillarList,
  MarketingShell,
} from "@/components/marketing-shell";
import { Card } from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/motion-primitives";
import { IconFile, IconClock, IconWallet, IconSend, IconCompass, IconUsers } from "@/components/ui/icons";
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

export default async function HowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("how");
  const flowT = await getTranslations("flow");

  const stages = t.raw("stages") as Array<{ title: string; body: string }>;
  const steps = flowT.raw("steps") as Record<
    string,
    { title: string; body: string; points: string[] }
  >;
  const icons = [IconFile, IconClock, IconWallet, IconSend, IconCompass, IconUsers];

  return (
    <>
      <MarketingNav items={NAV} />
      <main>
        <PageHero
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("intro")}
          cta={{ href: `/${locale}/cases/new`, label: flowT.raw("title") ? "Start a case" : "" }}
        />

        <MarketingShell withCta={false}>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Card key={stage.title} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon size={18} />
                    </div>
                    <span className="text-5xl font-semibold leading-none text-foreground/5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold tracking-tight">{stage.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{stage.body}</p>
                </Card>
              );
            })}
          </section>

          <section className="mt-20">
            <h2 className="text-2xl font-semibold tracking-tight">{flowT("title")}</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{flowT("subtitle")}</p>
            <Stagger className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(steps).map(([k, step]) => (
                <StaggerItem key={k}>
                  <Card className="h-full p-6">
                    <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
                    <div className="mt-4">
                      <PillarList items={step.points} />
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        </MarketingShell>
      </main>
      <SiteFooter />
    </>
  );
}
