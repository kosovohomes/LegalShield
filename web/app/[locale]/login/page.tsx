import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/server";
import { AuthShell } from "@/components/auth-shell";
import { IconArrowRight } from "@/components/ui/icons";
import type { Locale } from "@/i18n/routing";

const KNOWN_ERRORS = new Set(["invalid", "rate_limit", "not_confirmed", "failed"]);

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("auth");
  const sp = await searchParams;
  const errorKey = sp.error && KNOWN_ERRORS.has(sp.error) ? sp.error : null;
  const showCheckEmail = sp.notice === "check_email";

  async function signIn(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) redirect(`login?error=${toErrorCode(error.message)}`);
    redirect("dashboard");
  }

  async function signUp(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) redirect(`login?error=${toErrorCode(error.message)}`);
    if (!data.session) redirect("login?notice=check_email");
    redirect("dashboard");
  }

  const alert = errorKey
    ? ({ tone: "error", message: t(`errors.${errorKey}`) } as const)
    : showCheckEmail
    ? ({ tone: "success", message: t("checkEmail") } as const)
    : null;

  return (
    <AuthShell title={t("title")} subtitle={t("subtitle")} alert={alert}>
      <form className="flex flex-col gap-4">
        <Field label={t("email")}>
          <Input name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label={t("password")}>
          <Input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
          />
        </Field>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button formAction={signIn} className="gap-1.5">
            {t("title")}
            <IconArrowRight size={14} className="rtl:rotate-180" />
          </Button>
          <Button formAction={signUp} variant="outline" className="gap-1.5">
            {t("createAccount")}
          </Button>
        </div>
        <Link
          href={`/${locale}/forgot-password`}
          className="mt-1 text-end text-xs text-muted-foreground hover:text-foreground"
        >
          {t("forgotTitle")}
        </Link>
      </form>
    </AuthShell>
  );
}

function toErrorCode(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid") && m.includes("email")) return "invalid";
  if (m.includes("rate limit")) return "rate_limit";
  if (m.includes("not confirmed") || m.includes("email not confirmed")) return "not_confirmed";
  return "failed";
}
