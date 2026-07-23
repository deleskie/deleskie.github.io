import { hasSupabaseConfiguration } from "../env";
import { DevFileAccessRequestProvider } from "./dev-file-provider";
import type { AccessRequestProvider } from "./provider";
import { SupabaseAccessRequestProvider } from "./supabase-provider";

let cachedProvider: AccessRequestProvider | null | undefined;

export function getAccessRequestProvider(): AccessRequestProvider | null {
  if (cachedProvider !== undefined) {
    return cachedProvider;
  }

  if (hasSupabaseConfiguration()) {
    cachedProvider = new SupabaseAccessRequestProvider({
      url: process.env.SUPABASE_URL!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    });
    return cachedProvider;
  }

  if (process.env.NODE_ENV === "development") {
    cachedProvider = new DevFileAccessRequestProvider();
    return cachedProvider;
  }

  cachedProvider = null;
  return cachedProvider;
}

export function resetAccessRequestProviderForTests(): void {
  cachedProvider = undefined;
}
