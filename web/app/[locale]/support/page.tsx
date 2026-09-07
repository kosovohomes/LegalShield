import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconCheck, IconMail, IconLock, IconShield } from "@/components/ui/icons";
import type { Locale } from "@/i18n/routing";

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("support");
  const channels = t.raw("channels") as Array<{ label: string; value: string }>;
  const icons = [IconMail, IconLock, IconShield];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {channels.map((c, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Card key={c.value} className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon size={12} className="text-primary" />
                  {c.label}
                </div>
                <a
                  href={`mailto:${c.value}`}
                  className="mt-2 block text-sm font-medium hover:text-primary"
                >
                  {c.value}
                </a>
              </Card>
            );
          })}
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{t("status")}</div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconCheck size={12} className="text-emerald-400" />
                {t("statusOk")}
              </p>
            </div>
            <Badge tone="verified">Operational</Badge>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium">{t("docs")}</div>
          <p className="mt-1 text-sm text-muted-foreground">{t("docsBody")}</p>
        </Card>
      </div>
    </AppShell>
  );
}
