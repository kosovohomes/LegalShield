import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
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
  const t = await getTranslations();
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
    // "Confirm email" ON => no session until the user clicks the email link.
    if (!data.session) redirect("login?notice=check_email");
    redirect("dashboard");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>{t("nav.signIn")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            {errorKey && (
              <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                {t(`auth.errors.${errorKey}`)}
              </p>
            )}
            {showCheckEmail && (
              <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                {t("auth.checkEmail")}
              </p>
            )}
            <label className="flex flex-col gap-1 text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Password
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="rounded-md border border-zinc-300 px-3 py-2"
              />
            </label>
            <div className="flex gap-2">
              <Button formAction={signIn}>{t("nav.signIn")}</Button>
              <Button variant="outline" formAction={signUp}>
                {t("auth.createAccount")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

/** Map Supabase messages to stable, translatable codes (never leak raw errors). */
function toErrorCode(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid") && m.includes("email")) return "invalid";
  if (m.includes("rate limit")) return "rate_limit";
  if (m.includes("not confirmed") || m.includes("email not confirmed")) return "not_confirmed";
  return "failed";
}
