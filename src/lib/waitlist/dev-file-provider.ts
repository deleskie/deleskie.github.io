import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import type {
  AccessRequestProvider,
  AccessRequestStoreResult,
} from "./provider";
import type { StoredAccessRequest } from "./schema";

let writeQueue: Promise<void> = Promise.resolve();

export class DevFileAccessRequestProvider implements AccessRequestProvider {
  private readonly filePath: string;

  constructor(
    filePath = path.join(process.cwd(), ".data", "access-requests.jsonl"),
  ) {
    this.filePath = filePath;
  }

  async store(request: StoredAccessRequest): Promise<AccessRequestStoreResult> {
    let result: AccessRequestStoreResult = "created";

    writeQueue = writeQueue.then(async () => {
      await mkdir(path.dirname(this.filePath), { recursive: true });

      let existing = "";
      try {
        existing = await readFile(this.filePath, "utf8");
      } catch (error) {
        if (!isMissingFileError(error)) {
          throw error;
        }
      }

      const duplicate = existing
        .split("\n")
        .filter(Boolean)
        .some((line) => {
          try {
            const stored = JSON.parse(line) as { email?: unknown };
            return stored.email === request.email;
          } catch {
            return false;
          }
        });

      if (duplicate) {
        result = "duplicate";
        return;
      }

      await appendFile(
        this.filePath,
        `${JSON.stringify({
          ...request,
          createdAt: new Date().toISOString(),
        })}\n`,
        { encoding: "utf8", mode: 0o600 },
      );
    });

    await writeQueue;
    return result;
  }
}

function isMissingFileError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
