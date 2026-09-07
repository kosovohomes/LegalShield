import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CaseWizard } from "./case-wizard";
import { createClient } from "@/lib/supabase/server";
import { JURISDICTIONS, EVIDENCE_CATEGORIES } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

function resolveJurisdiction(raw: string): string {
  return JURISDICTIONS.includes(raw as (typeof JURISDICTIONS)[number])
    ? raw
    : "KW";
}

export default async function NewCasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("wizard");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  let defaultJurisdiction = "KW";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("default_jurisdiction")
      .eq("id", user.id)
      .maybeSingle();
    if (
      profile?.default_jurisdiction &&
      JURISDICTIONS.includes(profile.default_jurisdiction as (typeof JURISDICTIONS)[number])
    ) {
      defaultJurisdiction = profile.default_jurisdiction;
    }
  }

  async function createCaseWithIntake(
    formData: FormData,
  ): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: t("errorAuth") };

    const title = String(formData.get("title") ?? "").trim();
    if (title.length < 2 || title.length > 200)
      return { ok: false, error: t("errorTitle") };

    const jurisdiction = resolveJurisdiction(String(formData.get("jurisdiction") ?? ""));
    const caseType = String(formData.get("caseType") ?? "other");
    const description = String(formData.get("description") ?? "").trim();
    const startedOn = String(formData.get("startedOn") ?? "").trim();
    const opposingParty = String(formData.get("opposingParty") ?? "").trim();
    const lawyerName = String(formData.get("lawyerName") ?? "").trim();

    const haveDocs = formData
      .getAll("haveDocs")
      .map((v) => String(v))
      .filter((v) => EVIDENCE_CATEGORIES.includes(v as (typeof EVIDENCE_CATEGORIES)[number]));

    const { data, error } = await supabase
      .from("cases")
      .insert({
        owner_id: user.id,
        title,
        jurisdiction,
        case_type: caseType,
        description: description || null,
        intake: {
          caseType,
          jurisdiction,
          startedOn: startedOn || null,
          opposingParty: opposingParty || null,
          lawyerName: lawyerName || null,
          haveDocs,
        },
      })
      .select("id")
      .single();

    if (error || !data) return { ok: false, error: t("errorGeneric") };
    return { ok: true, id: data.id };
  }

  return (
    <AppShell variant="case">
      <div className="mx-auto grid max-w-3xl gap-6">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {t("eyebrow")}
          </span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <CaseWizard
          locale={locale}
          defaultJurisdiction={defaultJurisdiction}
          action={createCaseWithIntake}
        />
      </div>
    </AppShell>
  );
}