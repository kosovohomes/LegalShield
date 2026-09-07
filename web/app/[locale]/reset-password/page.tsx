import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("auth");

  async function update(formData: FormData) {
    "use server";
    const pw = String(formData.get("password") ?? "");
    if (pw.length < 8) return;
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return;
    redirect("dashboard");
  }

  return (
    <AuthShell title={t("resetTitle")} subtitle={t("resetSubtitle")}>
      <form action={update} className="flex flex-col gap-4">
        <Field label={t("newPassword")} hint="Minimum 8 characters">
          <Input name="password" type="password" required minLength={8} autoComplete="new-password" />
        </Field>
        <Button type="submit">{t("resetCta")}</Button>
      </form>
    </AuthShell>
  );
}
