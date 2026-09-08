import { getMessages } from "next-intl/server";
import { MarketingNav, type NavItem } from "@/components/marketing-nav";
import { SiteFooter } from "@/components/site-footer";

export type ChromeLabels = {
  brand: string;
  signIn: string;
  cta: string;
  nav: Record<string, string>;
  footer: Record<string, string>;
};

/**
 * Resolves the shared chrome strings through next-intl so locale pages show
 * fully localized navigation and footer. Runs only in the server-scope of a
 * locale page (inside the IntlProvider); error / not-found routes render the
 * literal fallbacks baked into the client components instead.
 */
async function chromeLabels(): Promise<ChromeLabels> {
  const ms = (await getMessages()) as Record<string, Record<string, string>> | undefined;
  const navMsgs = ms?.nav ?? {};
  const footerMsgs = ms?.footer ?? {};
  const rightsLabel = navMsgs.rights ?? "Client rights";

  return {
    brand: ms?.brand?.name ?? "LegalShield",
    signIn: navMsgs.signIn ?? "Sign in",
    cta: ms?.hero?.ctaPrimary ?? "Create a case",
    nav: {
      how: navMsgs.howItWorks ?? "How it works",
      security: navMsgs.security ?? "Security",
      verification: navMsgs.verificationGuides ?? "Verification",
      "lawyer-review": navMsgs.lawyerReview ?? "Lawyer review",
      rights: rightsLabel,
      pricing: navMsgs.pricing ?? "Pricing",
      about: navMsgs.about ?? "About",
      contact: navMsgs.contact ?? "Contact",
    },
    footer: {
      tagline:
        footerMsgs.tagline ??
        "Calm, secure evidence organization. Not a law firm. Not legal advice.",
      product: footerMsgs.product ?? "Product",
      legal: footerMsgs.legal ?? "Legal",
      regions: footerMsgs.regions ?? "Regions",
      regionsBody:
        footerMsgs.regionsBody ??
        "Currently available in Kuwait (KW) and Jordan (JO). Additional jurisdictions are gated on local legal review.",
      privacy: footerMsgs.privacy ?? "Privacy",
      terms: footerMsgs.terms ?? "Terms",
      disclaimer: footerMsgs.disclaimer ?? "Not legal advice",
      copyright: footerMsgs.copyright ?? "© {year} LegalShield.",
      notLawFirm:
        footerMsgs.notLawFirm ?? "Not a law firm. Not legal advice. AI output is observational.",
    },
  };
}

export async function ChromeNav({ items }: { items: NavItem[] }) {
  return <MarketingNav items={items} labels={await chromeLabels()} />;
}

export async function ChromeFooter() {
  return <SiteFooter labels={await chromeLabels()} />;
}