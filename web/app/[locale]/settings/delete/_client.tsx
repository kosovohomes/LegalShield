"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Disclaimer } from "@/components/ui/disclaimer";
import { IconAlert } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";

export function DeleteAccountClient({ locale, email }: { locale: string; email: string }) {
  const t = useTranslations("delete");
  const common = useTranslations("common");
  const router = useRouter();
  const [confirm, setConfirm] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function submit() {
    if (confirm !== "DELETE") {
      toast.error(t("blocked"));
      return;
    }
    setBusy(true);
    try {
      const sb = createClient();
      const {
        data: { session },
      } = await sb.auth.getSession();
      if (!session) {
        router.push(`/${locale}/login`);
        return;
      }
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "delete_failed");
      }
      await sb.auth.signOut();
      router.push(`/${locale}`);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Could not delete");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 text-destructive">
          <IconAlert size={18} />
          <span className="text-xs font-medium uppercase tracking-[0.18em]">{t("title")}</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        <Card className="mt-6 p-6">
          <p className="text-sm font-medium">{t("warning")}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {(t.raw("bullets") as string[]).map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 rounded-full bg-destructive" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-4">
            <Field label={t("confirm")}>
              <Input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="DELETE"
                autoComplete="off"
              />
            </Field>
            <Disclaimer tone="warning">
              This will permanently delete the account <span className="font-medium text-foreground">{email}</span>.
            </Disclaimer>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => history.back()} disabled={busy}>
                {common("cancel")}
              </Button>
              <Button variant="destructive" onClick={submit} disabled={busy || confirm !== "DELETE"}>
                {busy ? common("deleting") : t("final")}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
