import type { CountryCode, JurisdictionRights } from "./types";
import { kw } from "./kw";
import { jo } from "./jo";

export type { CountryCode, JurisdictionRights, Localized } from "./types";

export const rightsContent: Record<CountryCode, JurisdictionRights> = {
  KW: kw,
  JO: jo,
};

export const rightsOrder: CountryCode[] = ["KW", "JO"];

export function rightsByCountry(country: CountryCode): JurisdictionRights {
  return rightsContent[country];
}