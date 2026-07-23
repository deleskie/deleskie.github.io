import type { StoredAccessRequest } from "./schema";

export type AccessRequestStoreResult = "created" | "duplicate";

export interface AccessRequestProvider {
  store(request: StoredAccessRequest): Promise<AccessRequestStoreResult>;
}

export class StorageUnavailableError extends Error {
  constructor() {
    super("Access-request storage is unavailable.");
    this.name = "StorageUnavailableError";
  }
}
