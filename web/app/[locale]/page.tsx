import Link from "next/link";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import type { Locale } from "@/i18n/routing";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return <Landing />;
}

function Landing() {
  const t = useTranslations();
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex items-center justify-between">
        <div className="text-xl font-bold">{t("brand.name")}</div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="#how">{t("nav.howItWorks")}</Link>
          <Link href="#security">{t("nav.security")}</Link>
          <Link href="dashboard">{t("nav.dashboard")}</Link>
          <Link href="login">
            <Button size="sm">{t("nav.signIn")}</Button>
          </Link>
        </nav>
      </header>

      <section className="flex flex-col gap-4 py-8">
        <h1 className="text-4xl font-bold leading-tight">{t("hero.title")}</h1>
        <p className="max-w-2xl text-lg text-zinc-600">{t("hero.subtitle")}</p>
        <div className="flex gap-3">
          <Link href="cases/new">
            <Button size="lg">{t("hero.ctaPrimary")}</Button>
          </Link>
          <Link href="#how">
            <Button size="lg" variant="outline">
              {t("hero.ctaSecondary")}
            </Button>
          </Link>
        </div>
        <Disclaimer>
          {t("boundaries.is")} {t("boundaries.isNot")}
        </Disclaimer>
      </section>

      <section id="how" className="grid gap-4 md:grid-cols-3">
        {[
          { step: "1", body: "Evidence → Timeline → Expenses" },
          { step: "2", body: "Neutral request → record response" },
          { step: "3", body: "Verify via official channels → lawyer review" },
        ].map((s) => (
          <Card key={s.step}>
            <CardHeader>
              <CardTitle>{s.step}</CardTitle>
            </CardHeader>
            <CardContent>{s.body}</CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
