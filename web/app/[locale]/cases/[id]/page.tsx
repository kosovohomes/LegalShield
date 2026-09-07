import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";

const TABS = [
  "overview",
  "evidence",
  "timeline",
  "expenses",
  "requests",
  "verification",
  "export",
] as const;

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations();
  const supabase = await createClient();
  const { data: c } = await supabase
    .from("cases")
    .select("id,title,jurisdiction,status,description,created_at")
    .eq("id", id)
    .single();
  if (!c) notFound();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{c.title}</h1>
        <Badge tone="system_extraction">
          {c.jurisdiction} · {c.status}
        </Badge>
      </div>

      <nav className="flex flex-wrap gap-2 text-sm">
        {TABS.map((tab) => (
          <Link
            key={tab}
            href={`#${tab}`}
            className="rounded-full border border-zinc-300 px-3 py-1 hover:bg-zinc-100"
          >
            {tab}
          </Link>
        ))}
      </nav>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-600">
          {c.description ?? "—"}
        </CardContent>
      </Card>

      {(
        [
          ["evidence", "Build 02: encrypted upload + hash + activity history."],
          ["timeline", "Build 03: chronological record with fact/allegation badges."],
          ["expenses", "Build 03: reconciliation ledger."],
          ["requests", "Build 04: neutral correspondence drafts."],
          ["verification", "Build 05: official-channel guides."],
          ["export", "Build 04: PDF + evidence archive + review package."],
        ] as const
      ).map(([tab, body]) => (
        <Card key={tab} id={tab}>
          <CardHeader>
            <CardTitle className="capitalize">{tab}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-500">{body}</CardContent>
        </Card>
      ))}

      <Disclaimer>{t("disclaimers.aiAnalysis")}</Disclaimer>
    </main>
  );
}
