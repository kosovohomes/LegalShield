import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { DeleteAccountClient } from "./_client";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";

export default async function DeleteAccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  return (
    <AppShell>
      <DeleteAccountClient locale={locale} email={user.email ?? ""} />
    </AppShell>
  );
}
