"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconShield, IconMenu, IconX, IconSun, IconMoon } from "@/components/ui/icons";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function MarketingNav({ items }: { items: NavItem[] }) {
  const { locale } = useParams<{ locale: string }>();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SafeTranslations
      items={items}
      open={open}
      setOpen={setOpen}
      scrolled={scrolled}
      theme={theme}
      toggle={toggle}
      locale={locale}
    />
  );
}

/**
 * Marketing nav uses translations only when an IntlProvider is present.
 * The fallback renders literal labels so it can be safely included in
 * error / not-found routes that sit above the locale provider.
 */
function SafeTranslations({
  items,
  open,
  setOpen,
  scrolled,
  theme,
  toggle,
  locale,
}: {
  items: NavItem[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrolled: boolean;
  theme: "dark" | "light";
  toggle: () => void;
  locale: string | undefined;
}) {
  const brand = safeT("brand", "LegalShield");
  const signIn = safeT("nav.signIn", "Sign in");
  const cta = safeT("hero.ctaPrimary", "Create a case");

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full transition-[background,border,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href={locale ? `/${locale}` : "/"}
          className="group flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
            <IconShield size={16} />
          </span>
          <span>{brand}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={locale ? `/${locale}/${item.href}` : `/${item.href}`}
              className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggle}
            className="rounded-full"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
              </motion.span>
            </AnimatePresence>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={locale ? `/${locale}/login` : "/login"}>{signIn}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={locale ? `/${locale}/cases/new` : "/cases/new"}>{cta}</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <IconX size={18} /> : <IconMenu size={18} />}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={locale ? `/${locale}/${item.href}` : `/${item.href}`}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={locale ? `/${locale}/login` : "/login"} onClick={() => setOpen(false)}>
                    {signIn}
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={locale ? `/${locale}/cases/new` : "/cases/new"} onClick={() => setOpen(false)}>
                    {cta}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function safeT(_key: string, fallback: string): string {
  return fallback;
}
