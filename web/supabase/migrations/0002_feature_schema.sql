-- LegalShield Build 02 — feature schema (Phases 1–3)
-- Extends the Build 01 core schema. Reversible only as a whole; run once.

-- ================================================================ CASES ==
-- Wizard intake answers, case classification, public verification slug,
-- and a short phone-code for mobile capture.
alter table cases
  add column case_type text not null default 'other'
    check (case_type in ('labour', 'commercial', 'real_estate', 'family', 'traffic', 'other')),
  add column intake jsonb,
  add column public_slug text,
  add column phone_code text;

create unique index idx_cases_public_slug on cases(public_slug) where public_slug is not null;
create unique index idx_cases_phone_code on cases(phone_code) where phone_code is not null;

-- ======================================================== CASE_MEMBERS ==
-- Lawyer invite flow. Invitee accepts by matching invite_email to their
-- logged-in email; membership only grants read access when accepted.
alter table case_members
  add column invite_email text,
  add column invite_status text not null default 'pending'
    check (invite_status in ('pending', 'accepted', 'declined', 'revoked')),
  add column invited_at timestamptz,
  add column accepted_at timestamptz,
  add column consent_recorded boolean not null default false;

-- ======================================================== CASE_COMMENTS ==
-- Read-only lawyer/owner review thread.
create table case_comments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete cascade,
  visibility text not null default 'members'
    check (visibility in ('owner_only', 'members')),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index idx_case_comments_case on case_comments(case_id);
alter table case_comments enable row level security;

-- ================================================================ RLS ===
-- Helper: is the caller an accepted member of case X?
create or replace function is_case_member(p_case_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from case_members m
    where m.case_id = p_case_id
      and m.user_id = auth.uid()
      and m.invite_status = 'accepted'
  );
$$;

-- case_members — owner can read all invites; invitee can see + accept their own.
create policy "case_members owner read all" on case_members
  for select using (is_case_owner(case_id));
create policy "case_members invitee read pending" on case_members
  for select using (
    invite_email is not null
    and lower(invite_email) = lower(auth.jwt() ->> 'email')
  );
create policy "case_members accept invite" on case_members
  for update using (
    invite_email is not null
    and lower(invite_email) = lower(auth.jwt() ->> 'email')
    and invite_status = 'pending'
  )
  with check (user_id = auth.uid() and invite_status = 'accepted');

-- case_comments — owner all; accepted members read members/owner comments
-- and write only member-visible comments.
create policy "comments owner all" on case_comments
  for all using (is_case_owner(case_id)) with check (is_case_owner(case_id));
create policy "comments member read" on case_comments
  for select using (
    is_case_member(case_id) and visibility = 'members'
  );
create policy "comments member write" on case_comments
  for insert with check (
    is_case_member(case_id) and visibility = 'members'
  );

-- Member read-only select across the case data (lawyer portal).
create policy "evidence member read" on evidence_files
  for select using (is_case_member(case_id));
create policy "timeline member read" on timeline_events
  for select using (is_case_member(case_id));
create policy "expenses member read" on expense_records
  for select using (is_case_member(case_id));
create policy "docreq member read" on document_requests
  for select using (is_case_member(case_id));
create policy "ai member read" on ai_analyses
  for select using (is_case_member(case_id));
create policy "integrity member read" on evidence_integrity_events
  for select using (
    exists (select 1 from evidence_files e
      where e.id = evidence_integrity_events.evidence_file_id
        and is_case_member(e.case_id))
  );

-- ======================================================= STORAGE RLS ==
-- Private `evidence` bucket: owners full control on their own folder;
-- accepted members can read/stream objects belonging to the case.
create policy "evidence storage owner insert" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "evidence storage owner read" on storage.objects
  for select to authenticated using (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "evidence storage owner update" on storage.objects
  for update to authenticated using (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "evidence storage owner delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "evidence storage member read" on storage.objects
  for select to authenticated using (
    bucket_id = 'evidence'
    and exists (
      select 1 from evidence_files f
      where f.encrypted_storage_path = name
        and is_case_member(f.case_id)
    )
  );