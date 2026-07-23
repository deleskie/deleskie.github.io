export type PublicEnvironment = {
  indexable: boolean;
  analyticsProvider: "none" | "plausible";
  analyticsDomain?: string;
  analyticsScriptUrl?: string;
};

function isEnabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

export function getPublicEnvironment(): PublicEnvironment {
  const analyticsProvider =
    process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER === "plausible"
      ? "plausible"
      : "none";
  const analyticsDomain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN?.trim();
  const analyticsScriptUrl =
    process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL?.trim();

  return {
    indexable: isEnabled(process.env.NEXT_PUBLIC_INDEXABLE),
    analyticsProvider:
      analyticsProvider === "plausible" && analyticsDomain
        ? "plausible"
        : "none",
    ...(analyticsDomain ? { analyticsDomain } : {}),
    ...(analyticsScriptUrl ? { analyticsScriptUrl } : {}),
  };
}

export function hasSupabaseConfiguration(): boolean {
  return Boolean(
    process.env.SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}
