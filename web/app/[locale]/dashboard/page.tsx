import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cases: { id: string; title: string; jurisdiction: string; status: string }[] = [];
  if (user) {
    const { data } = await supabase
      .from("cases")
      .select("id,title,jurisdiction,status")
      .order("updated_at", { ascending: false })
      .limit(20);
    cases = data ?? [];
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
        <Link href={`/${locale}/cases/new`} className="text-sm underline">
          {t("case.new")}
        </Link>
      </div>

      {!user && (
        <Disclaimer>
          <Link href={`/${locale}/login`} className="underline">
            {t("nav.signIn")}
          </Link>
        </Disclaimer>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.activeCases")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{cases.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>0 {t("dashboard.needsVerification")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-500">
            Timeline + expense checks appear here (Build 03).
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>0 {t("dashboard.pendingRequests")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-500">
            Document requests appear here (Build 04).
          </CardContent>
        </Card>
      </div>

      <section className="flex flex-col gap-2">
        {cases.map((c) => (
          <Link key={c.id} href={`/${locale}/cases/${c.id}`}>
            <Card>
              <CardContent className="flex items-center justify-between pt-4">
                <span className="font-medium">{c.title}</span>
                <span className="text-xs text-zinc-500">
                  {c.jurisdiction} · {c.status}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
        {user && cases.length === 0 && (
          <p className="text-sm text-zinc-500">No cases yet.</p>
        )}
      </section>
    </main>
  );
}
