"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconUpload, IconX, IconCheck, IconHash, IconAlert } from "@/components/ui/icons";
import { hashFile, shortHash } from "@/lib/crypto/browser";
import { cn } from "@/lib/utils";

const MAX_BYTES = 50 * 1024 * 1024;

type QueueItem = {
  id: string;
  file: File;
  hash: string | null;
  status: "pending" | "hashing" | "uploading" | "done" | "error";
  error?: string;
};

export function EvidenceUpload({
  caseId,
  categories,
  onAdded,
}: {
  caseId: string;
  categories: readonly string[];
  onAdded?: (count: number) => void;
}) {
  const t = useTranslations("case.evidence");
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [drag, setDrag] = React.useState(false);
  const [queue, setQueue] = React.useState<QueueItem[]>([]);
  const [meta, setMeta] = React.useState<Record<string, { category: string; date: string; note: string }>>({});
  const [busyCount, setBusyCount] = React.useState(0);

  function addFiles(files: FileList | File[]) {
    const list = Array.from(files).slice(0, 20).map((file) => ({
      id: crypto.randomUUID(),
      file,
      hash: null,
      status: "pending" as const,
    }));
    setQueue((q) => [...q, ...list]);
  }

  function patchMeta(id: string, key: "category" | "date" | "note", value: string) {
    setMeta((m) => {
      const prev = m[id] ?? { category: "other", date: "", note: "" };
      return { ...m, [id]: { ...prev, [key]: value } };
    });
  }

  function remove(id: string) {
    setQueue((q) => q.filter((i) => i.id !== id));
    setMeta((m) => {
      const next = { ...m };
      delete next[id];
      return next;
    });
  }

  async function uploadOne(item: QueueItem) {
    if (item.status === "uploading" || item.status === "done") return;
    const m = meta[item.id] ?? { category: "other", date: "", note: "" };

    setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: "hashing", error: undefined } : i)));
    try {
      const hash = await hashFile(item.file);
      setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, hash, status: "uploading" } : i)));
      setBusyCount((c) => c + 1);

      const fd = new FormData();
      fd.set("caseId", caseId);
      fd.set("file", item.file);
      fd.set("category", m.category);
      fd.set("documentDate", m.date);
      fd.set("description", m.note);
      fd.set("clientHash", hash);

      const res = await fetch("/api/evidence", { method: "POST", body: fd });
      if (res.status === 401) {
        setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: "error", error: t("errorAuth") } : i)));
        return;
      }
      if (res.status === 413) {
        setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: "error", error: t("errorSize") } : i)));
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: "error", error: body.error ?? t("errorUnexpected") } : i)));
        return;
      }

      setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, hash, status: "done" } : i)));
      toast.success(t("uploaded", { name: item.file.name }));
      onAdded?.(1);
      router.refresh();
    } catch {
      setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: "error", error: t("errorUnexpected") } : i)));
    } finally {
      setBusyCount((c) => Math.max(0, c - 1));
    }
  }

  function uploadAll() {
    queue.filter((i) => i.status === "pending" && !i.hash).forEach(uploadOne);
  }

  const pending = queue.filter((i) => i.status !== "done").length;

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.msg,audio/*,video/*"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={cn(
          "cursor-pointer rounded-2xl border-2 border-dashed bg-card/40 p-10 text-center transition-colors",
          drag ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/30",
        )}
      >
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <IconUpload size={20} />
        </div>
        <h3 className="mt-4 text-base font-semibold">{t("drop")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("or")}{" "}
          <span className="text-primary underline-offset-4 hover:underline">
            {t("browse")}
          </span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground/80">{t("maxHint")}</p>
      </div>

      <AnimatePresence initial={false}>
        {queue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2 overflow-hidden"
          >
            {queue.map((item) => {
              const m = meta[item.id] ?? { category: "other", date: "", note: "" };
              const tooBig = item.file.size > MAX_BYTES;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/60 bg-card/60 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{item.file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(item.file.size / 1024 / 1024).toFixed(1)} MB
                        {tooBig && <span className="text-destructive"> · {t("errorSize")}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Remove"
                    >
                      <IconX size={14} />
                    </button>
                  </div>

                  {!tooBig && item.status !== "done" && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {t("category")}
                        </span>
                        <select
                          value={m.category}
                          onChange={(e) => patchMeta(item.id, "category", e.target.value)}
                          className="h-9 w-full rounded-lg border border-input bg-background/60 px-2 text-sm"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {t(`categories.${c}`)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {t("documentDate")}
                        </span>
                        <input
                          type="date"
                          value={m.date}
                          onChange={(e) => patchMeta(item.id, "date", e.target.value)}
                          className="h-9 w-full rounded-lg border border-input bg-background/60 px-2 text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {t("note")}
                        </span>
                        <input
                          value={m.note}
                          onChange={(e) => patchMeta(item.id, "note", e.target.value)}
                          maxLength={200}
                          className="h-9 w-full rounded-lg border border-input bg-background/60 px-2 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2 text-xs">
                      {item.status === "done" ? (
                        <>
                          <Badge tone="verified">
                            <IconCheck size={10} />
                            {t("hashed")}
                          </Badge>
                          {item.hash && (
                            <span className="flex min-w-0 items-center gap-1 font-mono text-muted-foreground" title={item.hash}>
                              <IconHash size={11} />
                              {shortHash(item.hash)}
                            </span>
                          )}
                        </>
                      ) : item.status === "error" ? (
                        <span className="flex items-center gap-1 text-destructive">
                          <IconAlert size={11} />
                          <span className="truncate">{item.error ?? t("errorUnexpected")}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <span className="size-3 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                          {item.status === "hashing" ? t("fileState.hashing") : t("fileState.uploading")}
                        </span>
                      )}
                    </div>
                    {item.status !== "done" && !tooBig && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => uploadOne(item)}
                        disabled={item.status === "hashing" || item.status === "uploading"}
                      >
                        {t("add")}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-muted-foreground">
                {t("remaining", { count: pending })}
              </span>
              <Button
                size="sm"
                onClick={uploadAll}
                disabled={pending === 0 || busyCount > 0}
                className="gap-2"
              >
                <IconUpload size={14} />
                {t("uploadAll")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}