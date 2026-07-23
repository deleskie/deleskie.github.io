import type {
  AccessRequestProvider,
  AccessRequestStoreResult,
} from "./provider";
import { StorageUnavailableError } from "./provider";
import type { StoredAccessRequest } from "./schema";

type SupabaseProviderOptions = {
  url: string;
  serviceRoleKey: string;
  fetchImplementation?: typeof fetch;
};

export class SupabaseAccessRequestProvider implements AccessRequestProvider {
  private readonly endpoint: string;
  private readonly serviceRoleKey: string;
  private readonly fetchImplementation: typeof fetch;

  constructor(options: SupabaseProviderOptions) {
    this.endpoint = `${options.url.replace(/\/+$/, "")}/rest/v1/access_requests?on_conflict=email`;
    this.serviceRoleKey = options.serviceRoleKey;
    this.fetchImplementation = options.fetchImplementation || fetch;
  }

  async store(request: StoredAccessRequest): Promise<AccessRequestStoreResult> {
    const response = await this.fetchImplementation(this.endpoint, {
      method: "POST",
      headers: {
        apikey: this.serviceRoleKey,
        Authorization: `Bearer ${this.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=headers-only",
      },
      body: JSON.stringify({
        email: request.email,
        name: request.name ?? null,
        region: request.region ?? null,
        interest: request.interest ?? null,
        invitation_code: request.invitationCode ?? null,
        referrer: request.referrer ?? null,
        utm_source: request.utmSource ?? null,
        utm_medium: request.utmMedium ?? null,
        utm_campaign: request.utmCampaign ?? null,
      }),
    });

    if (response.status === 409) {
      return "duplicate";
    }

    if (!response.ok) {
      throw new StorageUnavailableError();
    }

    const duplicate =
      response.headers
        .get("preference-applied")
        ?.includes("ignore-duplicates") && response.status === 200;

    return duplicate ? "duplicate" : "created";
  }
}
