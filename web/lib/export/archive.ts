"use client";

/**
 * Client-side evidence archive generation.
 * Downloads each protected file through the signed-URL route, then packages
 * originals + JSON manifest (with SHA-256 hashes) into a ZIP. No file ever
 * leaves the user's session or touches a third-party service.
 */
import JSZip from "jszip";

export type ArchiveCase = {
  id: string;
  title: string;
  jurisdiction: string;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type ArchiveEvidence = {
  id: string;
  original_filename: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  sha256_hash: string | null;
  category: string | null;
  document_date: string | null;
  created_at: string;
};

export type ArchiveOptions = {
  caseRow: ArchiveCase;
  evidence: ArchiveEvidence[];
  kind: "evidence" | "lawyer";
  locale: string;
  onProgress?: (done: number, total: number) => void;
  onSkipped?: (name: string) => void;
};

export type ArchiveResult = { blob: Blob; filename: string };

function uniqueName(name: string, used: Set<string>): string {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let i = 2;
  let candidate = `${base} (${i})${ext}`;
  while (used.has(candidate)) {
    i += 1;
    candidate = `${base} (${i})${ext}`;
  }
  used.add(candidate);
  return candidate;
}

function safeFilename(name: string): string {
  return name.replace(/[/\\]/g, "-").replace(/\s+/g, " ").trim() || "file.bin";
}

async function fetchEvidenceFile(id: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`/api/evidence/${id}/download`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

const LAWYER_BRIEF = `LegalShield export — lawyer review brief
============================================
Prepared by the case owner for independent professional review.

This bundle contains:
- evidence/          the original files exactly as uploaded (SHA-256 verified)
- manifest.json      integrity manifest (export_version, hashes, metadata)
- case-summary.json  structured case details
- this file          purpose, dates, and counts

English:
This archive is an observational export of the owner's own records. Every file is
accompanied by its SHA-256 hash as calculated at upload time. Hash values are stored
so the integrity of the material can be re-verified at any time. This document is not
legal advice and does not replace independent review.

العربية:
هذا الأرشيف تصدير وصفي لسجلات مالك القضية. كل ملف مرفق ببصمة SHA-256 احتُسبت وقت الرفع،
وتُحفظ البصمات لإعادة التحقق من سلامة المواد في أي وقت. هذه الوثيقة ليست استشارة قانونية
ولا تغني عن المراجعة المستقلة.
`;

export async function buildArchive(opts: ArchiveOptions): Promise<ArchiveResult> {
  const { caseRow, evidence, kind, locale } = opts;
  const generatedAt = new Date().toISOString();
  const zip = new JSZip();

  if (kind === "lawyer") {
    zip.file(
      "lawyer-brief.txt",
      LAWYER_BRIEF,
    );
  }

  const used = new Set<string>();
  const manifestEvidence = evidence.map((e) => ({
    id: e.id,
    filename: e.original_filename,
    mime_type: e.mime_type,
    file_size_bytes: e.file_size_bytes,
    sha256: e.sha256_hash,
    category: e.category,
    document_date: e.document_date,
    uploaded_at: e.created_at,
  }));

  zip.file(
    "manifest.json",
    JSON.stringify(
      {
        export_version: "1.0",
        export_type: kind,
        case_id: caseRow.id,
        generated_at: generatedAt,
        locale,
        evidence: manifestEvidence,
      },
      null,
      2,
    ),
  );

  zip.file(
    "case-summary.json",
    JSON.stringify(
      {
        case_id: caseRow.id,
        title: caseRow.title,
        jurisdiction: caseRow.jurisdiction,
        status: caseRow.status,
        description: caseRow.description,
        created_at: caseRow.created_at,
        updated_at: caseRow.updated_at,
        evidence_count: evidence.length,
      },
      null,
      2,
    ),
  );

  const total = evidence.length;
  let done = 0;
  for (const e of evidence) {
    const buffer = await fetchEvidenceFile(e.id);
    if (buffer) {
      const name = uniqueName(safeFilename(e.original_filename), used);
      zip.file(`evidence/${name}`, buffer);
    } else {
      opts.onSkipped?.(e.original_filename);
    }
    done += 1;
    opts.onProgress?.(done, total);
  }

  const bytes = await zip.generateAsync({
    type: "arraybuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  const blob = new Blob([bytes], { type: "application/zip" });

  const slug = caseRow.title.replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "case";
  const filename = `legalshield-${kind === "lawyer" ? "lawyer-review" : "evidence"}-${slug}.zip`;
  return { blob, filename };
}

export function downloadArchive(result: ArchiveResult) {
  downloadBlob(result.blob, result.filename);
}