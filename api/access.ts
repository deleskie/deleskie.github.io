import type { IncomingMessage, ServerResponse } from "node:http";

import { handleAccessRequest } from "../src/lib/waitlist/http";

export default async function accessRoute(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  await handleAccessRequest(request, response);
}
