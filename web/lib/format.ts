/** Locale-aware short relative time. No external deps. */
export function formatRelative(iso: string, locale: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (sec < 60) return locale === "ar" ? "الآن" : "just now";
  if (min < 60) return locale === "ar" ? `قبل ${min} د` : `${min}m ago`;
  if (hr < 24) return locale === "ar" ? `قبل ${hr} س` : `${hr}h ago`;
  if (day < 30) return locale === "ar" ? `قبل ${day} يوم` : `${day}d ago`;
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar" : "en", {
    month: "short",
    day: "numeric",
  });
}
