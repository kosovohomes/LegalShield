/**
 * PRD §§11–13, 17, 27, 42 — canonical vocabularies.
 * Never add verdict-like values here (e.g. "forged", "fraud_confirmed").
 */

export const JURISDICTIONS = ["JO", "KW"] as const;
export type Jurisdiction = (typeof JURISDICTIONS)[number];

export const CASE_STATUSES = [
  "active",
  "monitoring",
  "resolved",
  "closed",
  "archived",
] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

export const TIMELINE_CLASSIFICATIONS = [
  "user_fact",
  "user_allegation",
  "document_observation",
  "system_extraction",
  "ai_observation",
  "professional_opinion",
] as const;
export type TimelineClassification =
  (typeof TIMELINE_CLASSIFICATIONS)[number];

export const EXPENSE_STATUSES = [
  "unverified",
  "document_supported",
  "payment_supported",
  "conflicting",
  "user_confirmed",
  "professional_review_required",
] as const;

export const DOCUMENT_REQUEST_STATUSES = [
  "draft",
  "scheduled",
  "sent",
  "responded",
  "closed",
] as const;

export const EXPORT_JOB_STATUSES = [
  "queued",
  "processing",
  "completed",
  "failed",
  "cancelled",
] as const;

/** Phrases the AI layer must never emit (§§17.2, 27). Enforced by tests. */
export const BLOCKED_AI_PHRASES = [
  "forged",
  "definitely fake",
  "fraud confirmed",
  "lawyer committed fraud",
  "court document is invalid",
  "misconduct confirmed",
] as const;

export const EVIDENCE_CATEGORIES = [
  "lawyer_correspondence",
  "whatsapp_export",
  "email",
  "receipt",
  "invoice",
  "bank_payment_record",
  "court_document",
  "power_of_attorney",
  "contract",
  "photograph",
  "audio",
  "video",
  "other",
] as const;
