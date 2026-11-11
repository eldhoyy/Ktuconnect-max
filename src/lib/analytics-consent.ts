export type AnalyticsConsent = "unknown" | "yes" | "no";
export const ANALYTICS_CONSENT_KEY = "cohertx-analytics-consent";

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "unknown";
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === "yes" || value === "no" ? value : "unknown";
}
export function writeAnalyticsConsent(value: Exclude<AnalyticsConsent, "unknown">) {
  if (typeof window !== "undefined") window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
}