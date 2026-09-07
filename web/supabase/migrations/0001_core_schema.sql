-- LegalShield Build 01+ — core schema (PRD §§21–24)
-- Identity source is auth.users; application data lives in profiles.
-- Run with: supabase db push (migration)

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  preferred_language text not null default 'ar'
    check (preferred_language in ('ar', 'en')),
  default_jurisdiction text
    check (default_jurisdiction in ('JO', 'KW')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- cases
create table cases (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 200),
  jurisdiction text not null
    check (jurisdiction in ('JO', 'KW')),
  case_number text,
  court_name text,
  lawyer_name text,
  lawyer_email text,
  lawyer_phone text,
  description text,
  status text not null default 'active'
    check (status in ('active', 'monitoring', 'resolved', 'closed', 'archived')),
  litigation_hold boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_cases_owner on cases(owner_id);

-- ------------------------------------------------------------ case_members
-- Future lawyer-portal / shared access. No rows => owner-only (Build 01).
create table case_members (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'viewer'
    check (role in ('viewer', 'editor')),
  created_at timestamptz not null default now(),
  unique (case_id, user_id)
);
create index idx_case_members_case on case_members(case_id);

-- ---------------------------------------------------------- evidence_files
create table evidence_files (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  original_filename text not null,
  mime_type text,
  file_size_bytes bigint,
  encrypted_storage_path text not null,
  sha256_hash text not null check (length(sha256_hash) = 64),
  category text not null default 'other',
  description text,
  document_date timestamptz,
  encryption_version text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_evidence_case on evidence_files(case_id);

-- ------------------------------------------------- evidence_integrity_events
create table evidence_integrity_events (
  id uuid primary key default gen_random_uuid(),
  evidence_file_id uuid not null references evidence_files(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  sha256_hash text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index idx_evidence_events_file
  on evidence_integrity_events(evidence_file_id);

-- ---------------------------------------------------------- timeline_events
create table timeline_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  event_date timestamptz,
  title text not null,
  description text,
  classification text not null default 'user_fact'
    check (
      classification in (
        'user_fact',
        'user_allegation',
        'document_observation',
        'system_extraction',
        'ai_observation',
        'professional_opinion'
      )
    ),
  source_evidence_id uuid references evidence_files(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_timeline_case on timeline_events(case_id);

-- ---------------------------------------------------------- expense_records
create table expense_records (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  expense_date date,
  amount numeric(14,2),
  currency text not null,
  claimed_purpose text,
  payee text,
  payment_method text,
  receipt_evidence_id uuid references evidence_files(id) on delete set null,
  payment_evidence_id uuid references evidence_files(id) on delete set null,
  status text not null default 'unverified'
    check (
      status in (
        'unverified',
        'document_supported',
        'payment_supported',
        'conflicting',
        'user_confirmed',
        'professional_review_required'
      )
    ),
  notes text,
  created_at timestamptz not null default now()
);
create index idx_expenses_case on expense_records(case_id);

-- -------------------------------------------------------- document_requests
create table document_requests (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  request_type text not null,
  factual_summary text,
  requested_items jsonb not null default '[]'::jsonb,
  generated_text text,
  legal_basis jsonb,
  template_version text,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'sent', 'responded', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_docreq_case on document_requests(case_id);

-- ----------------------------------------------------- communication_events
create table communication_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  document_request_id uuid references document_requests(id) on delete set null,
  channel text not null,
  event_type text not null,
  provider text,
  provider_event_id text,
  event_at timestamptz not null default now(),
  notes text
);
create index idx_commev_case on communication_events(case_id);

-- -------------------------------------------------------------- ai_analyses
create table ai_analyses (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  evidence_file_id uuid references evidence_files(id) on delete set null,
  analysis_type text not null,
  model_provider text,
  model_version text,
  prompt_version text,
  result_json jsonb not null,
  disclaimer_version text,
  created_at timestamptz not null default now()
);
create index idx_aianalyses_case on ai_analyses(case_id);

-- ------------------------------------------------------ verification_guides
create table verification_guides (
  id uuid primary key default gen_random_uuid(),
  jurisdiction text not null check (jurisdiction in ('JO', 'KW')),
  authority_name text not null,
  title text not null,
  content jsonb not null,
  official_source_url text,
  source_description text,
  last_verified_at timestamptz,
  next_review_at timestamptz,
  reviewer text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------ verification_events
create table verification_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  guide_id uuid references verification_guides(id) on delete set null,
  completed_at timestamptz,
  result text,
  user_notes text,
  evidence_file_id uuid references evidence_files(id) on delete set null,
  created_at timestamptz not null default now()
);
create index idx_verev_case on verification_events(case_id);

-- ---------------------------------------------------------- lawyer_profiles
create table lawyer_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  jurisdiction text not null check (jurisdiction in ('JO', 'KW')),
  license_number text,
  practice_areas text[],
  languages text[],
  consultation_fee numeric(14,2),
  consultation_currency text,
  profile_status text not null default 'pending'
    check (profile_status in ('pending', 'active', 'suspended', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------- lawyer_verification_events
create table lawyer_verification_events (
  id uuid primary key default gen_random_uuid(),
  lawyer_id uuid not null references lawyer_profiles(id) on delete cascade,
  verification_type text not null,
  source_description text,
  verified_at timestamptz not null default now(),
  expires_at timestamptz,
  verified_by text,
  notes text
);

-- -------------------------------------------------------- referral_requests
create table referral_requests (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  requested_specialization text,
  status text not null default 'requested'
    check (
      status in ('requested', 'matched', 'contacted', 'booked', 'completed', 'cancelled')
    ),
  created_at timestamptz not null default now()
);
create index idx_referrals_case on referral_requests(case_id);

-- -------------------------------------------------------------- export_jobs
create table export_jobs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  export_type text not null,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  storage_path text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index idx_exports_case on export_jobs(case_id);

-- --------------------------------------------------------------- audit_logs
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text,
  resource_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_user on audit_logs(user_id);

-- ------------------------------------------------------------ legal_sources
-- PRD §26.1: every legal claim cites a versioned source row, never hard-code.
create table legal_sources (
  id uuid primary key default gen_random_uuid(),
  jurisdiction text not null check (jurisdiction in ('JO', 'KW')),
  authority text not null,
  title text not null,
  article_section text,
  official_source_url text,
  language text not null default 'ar' check (language in ('ar', 'en')),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'verified', 'superseded')),
  reviewer text,
  reviewed_at timestamptz,
  superseded_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------- legal_templates
-- PRD §26.2: AI legal-basis mode may only use approved template versions.
create table legal_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null,
  jurisdiction text not null check (jurisdiction in ('JO', 'KW')),
  purpose text not null,
  approved_text text not null,
  legal_source_ids uuid[] not null default '{}',
  version text not null default '1.0.0',
  reviewer text,
  approved_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (template_key, jurisdiction, version)
);

-- ---------------------------------------------------------- consent_records
-- Privacy/opt-in trail (exports, AI processing, notifications).
create table consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  purpose text not null,
  granted boolean not null,
  policy_version text,
  created_at timestamptz not null default now()
);
create index idx_consent_user on consent_records(user_id);

-- ================================================================== RLS ===
alter table profiles enable row level security;
alter table cases enable row level security;
alter table case_members enable row level security;
alter table evidence_files enable row level security;
alter table evidence_integrity_events enable row level security;
alter table timeline_events enable row level security;
alter table expense_records enable row level security;
alter table document_requests enable row level security;
alter table communication_events enable row level security;
alter table ai_analyses enable row level security;
alter table verification_events enable row level security;
alter table referral_requests enable row level security;
alter table export_jobs enable row level security;
alter table consent_records enable row level security;
alter table audit_logs enable row level security;

-- Helper: is the caller the owner of case X?
create or replace function is_case_owner(p_case_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from cases c
    where c.id = p_case_id and c.owner_id = auth.uid()
  );
$$;

-- profiles: user manages own row only
create policy "profiles owner all" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- cases: owner-only CRUD
create policy "cases owner select" on cases
  for select using (auth.uid() = owner_id);
create policy "cases owner insert" on cases
  for insert with check (auth.uid() = owner_id);
create policy "cases owner update" on cases
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "cases owner delete" on cases
  for delete using (auth.uid() = owner_id);

-- case_members: owner can manage; members can read their own membership
create policy "case_members owner all" on case_members
  for all using (is_case_owner(case_id)) with check (is_case_owner(case_id));
create policy "case_members self read" on case_members
  for select using (auth.uid() = user_id);

-- Generic child-table pattern: authorize through parent case ownership.
-- evidence_files
create policy "evidence owner read" on evidence_files
  for select using (is_case_owner(case_id));
create policy "evidence owner write" on evidence_files
  for insert with check (is_case_owner(case_id));
create policy "evidence owner update" on evidence_files
  for update using (is_case_owner(case_id)) with check (is_case_owner(case_id));
create policy "evidence owner delete" on evidence_files
  for delete using (is_case_owner(case_id));

-- evidence_integrity_events: append-only (no update/delete by clients)
create policy "integrity owner read" on evidence_integrity_events
  for select using (
    exists (select 1 from evidence_files e
      where e.id = evidence_integrity_events.evidence_file_id
        and is_case_owner(e.case_id))
  );
create policy "integrity owner insert" on evidence_integrity_events
  for insert with check (
    exists (select 1 from evidence_files e
      where e.id = evidence_integrity_events.evidence_file_id
        and is_case_owner(e.case_id))
  );

-- timeline_events
create policy "timeline owner all" on timeline_events
  for all using (is_case_owner(case_id)) with check (is_case_owner(case_id));

-- expense_records
create policy "expenses owner all" on expense_records
  for all using (is_case_owner(case_id)) with check (is_case_owner(case_id));

-- document_requests
create policy "docreq owner all" on document_requests
  for all using (is_case_owner(case_id)) with check (is_case_owner(case_id));

-- communication_events
create policy "commev owner all" on communication_events
  for all using (is_case_owner(case_id)) with check (is_case_owner(case_id));

-- ai_analyses: read + insert via case; never update (provenance immutable)
create policy "ai owner read" on ai_analyses
  for select using (is_case_owner(case_id));
create policy "ai owner insert" on ai_analyses
  for insert with check (is_case_owner(case_id));

-- verification_events
create policy "verev owner all" on verification_events
  for all using (is_case_owner(case_id)) with check (is_case_owner(case_id));

-- referral_requests
create policy "referrals owner all" on referral_requests
  for all using (is_case_owner(case_id)) with check (is_case_owner(case_id));

-- export_jobs
create policy "exports owner all" on export_jobs
  for all using (is_case_owner(case_id)) with check (is_case_owner(case_id));

-- consent_records: own rows only
create policy "consent owner all" on consent_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- audit_logs: users read own entries; inserts via server-side only
create policy "audit owner read" on audit_logs
  for select using (auth.uid() = user_id);

-- verification_guides / lawyer_profiles / legal_sources / legal_templates:
-- curated content, publicly readable active rows; writes restricted to service role.
alter table verification_guides enable row level security;
alter table lawyer_profiles enable row level security;
alter table lawyer_verification_events enable row level security;
alter table legal_sources enable row level security;
alter table legal_templates enable row level security;

create policy "guides public read active" on verification_guides
  for select using (is_active = true);
create policy "lawyers public read active" on lawyer_profiles
  for select using (profile_status = 'active');
create policy "legal sources public read verified" on legal_sources
  for select using (verification_status = 'verified');
create policy "legal templates public read active" on legal_templates
  for select using (is_active = true);

-- ================================================================ STORAGE ==
-- Create a PRIVATE bucket named `evidence` via dashboard/SQL, then:
--   - block public access; signed URLs only, short TTL;
--   - object path convention: {user_id}/{case_id}/{evidence_id}/encrypted.bin;
--   - authorize every download against is_case_owner();
--   - never log raw bytes; validate MIME + size before hashing.
