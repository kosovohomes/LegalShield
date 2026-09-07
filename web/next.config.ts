import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* Build 01: strict server-only secrets; no service-role key in client bundle. */
};

export default withNextIntl(nextConfig);
