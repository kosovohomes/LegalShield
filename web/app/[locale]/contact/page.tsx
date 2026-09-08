import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChromeNav as MarketingNav } from "@/components/marketing-chrome";
import { ChromeFooter as SiteFooter } from "@/components/marketing-chrome";
import { PageHero, MarketingShell } from "@/components/marketing-shell";
import { Card } from "@/components/ui/card";
import { Field, Input, Label, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { IconMail, IconLock, IconShield } from "@/components/ui/icons";
import { Disclaimer } from "@/components/ui/disclaimer";
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("contact");
  const channels = t.raw("channels") as Array<{ label: string; value: string; hint: string }>;
  const topics = t.raw("topics") as string[];
  const icons = [IconMail, IconLock, IconShield];

  return (
    <>
      <MarketingNav items={NAV} />
      <main>
        <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <MarketingShell withCta={false}>
          <section className="grid gap-4 md:grid-cols-3">
            {channels.map((c, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Card key={c.value} className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon size={12} className="text-primary" />
                    {c.label}
                  </div>
                  <a
                    href={`mailto:${c.value}`}
                    className="mt-2 block text-sm font-medium text-foreground hover:text-primary"
                  >
                    {c.value}
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
                </Card>
              );
            })}
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <Card className="p-6">
              <h2 className="text-lg font-semibold tracking-tight">{t("formTitle")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("formSubtitle")}</p>
              <form className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("fields.name")}>
                    <Input name="name" autoComplete="name" />
                  </Field>
                  <Field label={t("fields.email")}>
                    <Input name="email" type="email" required autoComplete="email" />
                  </Field>
                </div>
                <Field label={t("fields.topic")}>
                  <select
                    name="topic"
                    className="h-10 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    {topics.map((tp) => (
                      <option key={tp} value={tp}>
                        {tp}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("fields.message")}>
                  <Textarea name="message" rows={5} required />
                </Field>
                <div className="flex justify-end">
                  <Button type="submit">{t("submit")}</Button>
                </div>
              </form>
              <Disclaimer tone="info" className="mt-4">
                We never share contact form data with third parties. We use it only to reply to
                you.
              </Disclaimer>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold tracking-tight">Response times</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>General support — within 1 business day</li>
                <li>Security reports — within 24 hours, 7 days a week</li>
                <li>Privacy requests — within statutory windows</li>
              </ul>
              <h3 className="mt-6 text-sm font-semibold tracking-tight">Office</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We are a distributed team with advisors in Kuwait and Jordan. The legal entity is
                incorporated per jurisdiction where we operate.
              </p>
            </Card>
          </section>
        </MarketingShell>
      </main>
      <SiteFooter />
    </>
  );
}
