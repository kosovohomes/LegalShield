# LegalShield — Project Notes (agent + human)

## Live site
- **Production URL (new):** https://ls.mokhamen.com
- Vercel aliases: https://web-self-beta-95.vercel.app, https://legalshieldopen.vercel.app
- Repo: `https://github.com/kosovohomes/LegalShield.git` — branch `main`

## Workflow
- **Commit + push WITHOUT asking for approval.** The user has authorized automatic
  commits and pushes to `main`. Always run gates (`npx tsc --noEmit`, `npm run build`)
  and stage only intended files before committing. Write concise commits matching the
  existing style: `LegalShield Build NN: <short scope>`.
- Deploys: from `web/` via `npx vercel --prod --yes`. After deploy, note the new
  production URL; the custom domain `ls.mokhamen.com` is the canonical address.
- Local prod server: `node node_modules/next/dist/bin/next start -p 3001` (workdir `web/`).
- This machine cannot reach `*.vercel.app` or `*.trycloudflare.com` (DNS/TLS blocked).
  Verify via built static HTML in `web/.next/server/app/**` or ask the user to check.

## Product grounding
- Bilingual Next.js app; default locale `ar` (RTL), `en` mirror; all routes `/[locale]/...`.
- Marketing chrome is localized via `web/components/marketing-chrome.tsx` (server)
  feeding prop-driven `MarketingNav` / `SiteFooter` with literal fallbacks for
  error/not-found pages above the locale provider.
- Public Rights Hub (KW + JO): content in `web/lib/rights/` (inline `{en, ar}` content,
  not i18n JSON). Procedural items are `verified:false` → "verify with official source"
  badge; page carries not-legal-advice disclaimers. Content rules per PRD §17.2/§27:
  restrained observational copy only; never `BLOCKED_AI_PHRASES`; facts ≠ allegations.
- Phase 2 backlog: printable/PDF case export + ZIP manifest; checklist + draft
  request-letter flow; lawyer invite portal; verification links for Rights Hub
  "verify with official source" badges; observational AI case organizer.
- See `LegalShield_PRD_v4_0_Revised.md` for the full product spec.