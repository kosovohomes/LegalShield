import type { Jurisdiction } from "./constants";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  preferred_language: "ar" | "en";
  default_jurisdiction: Jurisdiction | null;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  owner_id: string;
  title: string;
  jurisdiction: Jurisdiction;
  case_number: string | null;
  court_name: string | null;
  lawyer_name: string | null;
  lawyer_email: string | null;
  lawyer_phone: string | null;
  description: string | null;
  status: string;
  litigation_hold: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  case_id: string;
  event_date: string | null;
  title: string;
  description: string | null;
  classification: string;
  source_evidence_id: string | null;
  created_at: string;
}
