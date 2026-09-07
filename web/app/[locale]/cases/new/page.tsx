import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Label, Textarea } from "@/components/ui/field";
import { Disclaimer } from "@/components/ui/disclaimer";
import { createClient } from "@/lib/supabase/server";
import { JURISDICTIONS } from "@/lib/constants";
import { IconArrowRight, IconSparkles } from "@/components/ui/icons";
import type { Locale } from "@/i18n/routing";

export default async function NewCasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("case");

  async function createCase(formData: FormData) {
    "use server";
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const jurisdiction = String(formData.get("jurisdiction") ?? "");
    if (title.length < 2 || title.length > 200) return;
    if (!JURISDICTIONS.includes(jurisdiction as (typeof JURISDICTIONS)[number])) return;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("cases")
      .insert({
        owner_id: user.id,
        title,
        jurisdiction: jurisdiction as (typeof JURISDICTIONS)[number],
        description: description || null,
      })
      .select("id")
      .single();
    if (!error && data) redirect(`/${locale}/cases/${data.id}`);
  }

  return (
    <AppShell variant="case">
      <div className="mx-auto grid max-w-3xl gap-6">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {t("new")}
          </span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t("new")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <Card className="p-6 sm:p-8">
          <form action={createCase} className="flex flex-col gap-5">
            <Field label={t("title")} hint="2–200 characters">
              <Input name="title" required minLength={2} maxLength={200} />
            </Field>
            <Field label={t("jurisdiction")}>
              <div className="grid grid-cols-2 gap-2">
                {JURISDICTIONS.map((j) => (
                  <label
                    key={j}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40 hover:bg-card has-[input:checked]:border-primary has-[input:checked]:bg-primary/5"
                  >
                    <input
                      type="radio"
                      name="jurisdiction"
                      value={j}
                      defaultChecked={j === "KW"}
                      className="size-4 accent-primary"
                      required
                    />
                    <div>
                      <div className="text-sm font-medium">
                        {j === "KW" ? "Kuwait · الكويت" : "Jordan · الأردن"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {j === "KW" ? "Primary court and ministry guides." : "Magistrate and cassation guides."}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </Field>
            <Field label={t("description")} hint="Optional. A few sentences about what this case is about.">
              <Textarea name="description" rows={4} maxLength={5000} />
            </Field>
            <Disclaimer tone="info">
              You can add evidence, timeline events, expenses, and request drafts after the case is created. Nothing leaves your device unencrypted.
            </Disclaimer>
            <div className="flex items-center justify-end gap-2">
              <Button type="submit" size="lg" className="gap-2">
                <IconSparkles size={14} />
                {t("create")}
                <IconArrowRight size={14} className="rtl:rotate-180" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
