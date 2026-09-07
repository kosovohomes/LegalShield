import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@/components/ui/icons";
import { MarketingNav } from "@/components/marketing-nav";
import { SiteFooter } from "@/components/site-footer";
import type { Locale } from "@/i18n/routing";

export default async function NotFound() {
  return (
    <div className="min-h-dvh">
      <div className="aurora fixed inset-x-0 top-0 h-[420px] opacity-60" aria-hidden />
      <MarketingNav items={[]} />
      <main className="relative mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-6 text-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">404</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you tried to open doesn't exist or has moved.
          </p>
          <Button asChild size="lg" className="mt-6 gap-2">
            <Link href="/ar">
              <IconArrowLeft size={14} className="rtl:rotate-180" />
              Go home
            </Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
