import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("auth");

  async function resend() {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) {
      await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });
    }
    redirect("verify-email?resent=1");
  }

  return (
    <AuthShell
      title={t("verifyTitle")}
      subtitle={t("verifySubtitle")}
      alert={null}
    >
      <form action={resend}>
        <Button type="submit" className="w-full">
          {t("verifyResend")}
        </Button>
      </form>
    </AuthShell>
  );
}
