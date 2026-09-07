# Encryption Decision — CSE-A vs CSE-B (PRD §9)

Status: **deferred — both paths planned, Build 02 implements the switch.**
Rule: public copy must match technical behavior. Never claim
"zero-knowledge" or "military-grade". Approved claim:

> "Client-side encrypted evidence storage designed to minimize platform
> access to evidence contents."

## Option A — Simplified client-side envelope encryption (target)

- WebCrypto AES-256-GCM per-file DEK; DEK wrapped by KEK derived from
  user password (KDF params defined in security spec, not in PRD).
- Server stores only: encrypted bytes + wrapped DEK + non-sensitive
  metadata (filename, MIME, size, SHA-256 of plaintext, timestamps).
- Recovery (choose ONE before launch, §9.4): user-managed recovery key
  shown once at setup (recommended for MVP) — password loss without it
  means permanent loss; the UI must say so explicitly.
- Pros: strongest privacy story; matches PRD ambition.
- Cons: recovery UX burden; OCR/AI must run client-side or on
  user-decrypted copies with explicit consent + processor disclosure (§28.3).

## Option B — Private bucket + RLS first, CSE as iteration (fallback)

- Supabase Storage private bucket, signed URLs with short TTL,
  `is_case_owner()` authorization on every access, RLS everywhere.
- Server holds decryptable bytes (Supabase encryption at rest).
- Pros: ships faster; OCR/AI/export trivially server-side.
- Cons: must NOT claim client-side encryption; privacy policy must list
  processors; migration to A later requires re-encryption job + UX.

## Recommendation

Build 02 ships the **storage + metadata + integrity pipeline behind a
`CryptoProvider` interface** (`encryptFile/decryptFile/wrapKey`) with two
adapters: `ServerBucketAdapter` (B) and `EnvelopeAesGcmAdapter` (A).
Default to **A** for new uploads once recovery-key UX + KDF review pass;
otherwise run **B** and disclose accurately. Both adapters emit identical
`evidence_files` rows + `evidence_integrity_events`, so the switch is
non-breaking.

## Pre-launch gates (§60)

- KDF parameters + key-rotation + logout/session behavior reviewed.
- Recovery flow tested (lose-password drill: data unrecoverable without key).
- RLS + storage penetration tests pass; no service-role key in client bundle.
- Third-party processors (OCR/AI/email) listed in Privacy Policy.
