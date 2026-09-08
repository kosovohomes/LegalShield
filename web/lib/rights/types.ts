export type Localized = { en: string; ar: string };

export type CountryCode = "KW" | "JO";

export type RightsItem = {
  id: string;
  title: Localized;
  body: Localized;
};

export type Duty = {
  id: string;
  title: Localized;
  body: Localized;
  standard: Localized;
};

export type Course = {
  id: "misconduct" | "malpractice" | "fiduciary";
  title: Localized;
  body: Localized;
  indicators: Localized[];
};

export type Courses = {
  misconduct: Course;
  malpractice: Course;
  fiduciary: Course;
};

export type ActionStep = {
  title: Localized;
  body: Localized;
  authority?: string;
};

export type AvailableAction = {
  id: string;
  eyebrow: Localized;
  title: Localized;
  body: Localized;
  bestFor: Localized;
  evidence: Localized[];
  steps: ActionStep[];
  verified: boolean;
  parallel: Localized;
};

export type Resource = {
  id: string;
  authority: Localized;
  role: Localized;
  verified: boolean;
  note?: Localized;
};

export type Template = {
  id: string;
  title: Localized;
  recipient: Localized;
  body: Localized;
};

export type JurisdictionRights = {
  country: CountryCode;
  name: Localized;
  flag: string;
  intro: Localized;
  basis: Localized;
  rightsLead: Localized;
  rights: RightsItem[];
  dutiesLead: Localized;
  duties: Duty[];
  coursesLead: Localized;
  courses: Courses;
  evidenceLead: Localized;
  evidence: RightsItem[];
  actionsLead: Localized;
  actions: AvailableAction[];
  parallelLead: Localized;
  parallel: Localized[];
  templatesLead: Localized;
  templates: { note: Localized; items: Template[] };
  resourcesLead: Localized;
  resources: Resource[];
  verify: Localized;
  updated: Localized;
};