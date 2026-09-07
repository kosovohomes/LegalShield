import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("auth");

  async function requestReset(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/${locale}/reset-password`,
    });
    // Always confirm — do not leak whether the email exists.
    redirect("forgot-password?sent=1");
  }

  return (
    <AuthShell title={t("forgotTitle")} subtitle={t("forgotSubtitle")}>
      <form action={requestReset} className="flex flex-col gap-4">
        <Field label={t("email")}>
          <Input name="email" type="email" required autoComplete="email" />
        </Field>
        <Button type="submit" className="mt-1">
          {t("forgotCta")}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          {t("forgotSent")}
        </p>
      </form>
    </AuthShell>
  );
}
