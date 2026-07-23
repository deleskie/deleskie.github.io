import { siteContent } from "../../content/site";
import type { AccessRequestProvider } from "./provider";
import { StorageUnavailableError } from "./provider";
import { accessRequestSchema, type StoredAccessRequest } from "./schema";

export type AccessResponseBody = {
  ok: boolean;
  state: "success" | "invalid" | "unavailable" | "error" | "limited";
  message: string;
  fieldErrors?: Record<string, string>;
};

export type AccessSubmissionResult = {
  status: number;
  body: AccessResponseBody;
};

const successResponse: AccessSubmissionResult = {
  status: 200,
  body: {
    ok: true,
    state: "success",
    message: siteContent.access.successMessage,
  },
};

export async function processAccessSubmission(
  input: unknown,
  provider: AccessRequestProvider,
): Promise<AccessSubmissionResult> {
  const parsed = accessRequestSchema.safeParse(input);

  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const fieldErrors: Record<string, string> = {};

    for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
      if (messages?.[0]) {
        fieldErrors[field] =
          field === "email"
            ? siteContent.access.validation.emailInvalid
            : siteContent.access.validation.formInvalid;
      }
    }

    return {
      status: 400,
      body: {
        ok: false,
        state: "invalid",
        message: siteContent.access.validation.formInvalid,
        ...(Object.keys(fieldErrors).length > 0 ? { fieldErrors } : {}),
      },
    };
  }

  if (parsed.data.companyWebsite.length > 0) {
    return successResponse;
  }

  const request: StoredAccessRequest = {
    email: parsed.data.email,
    ...(parsed.data.name ? { name: parsed.data.name } : {}),
    ...(parsed.data.region ? { region: parsed.data.region } : {}),
    ...(parsed.data.interest ? { interest: parsed.data.interest } : {}),
    ...(parsed.data.invitationCode
      ? { invitationCode: parsed.data.invitationCode }
      : {}),
    ...(parsed.data.referrer ? { referrer: parsed.data.referrer } : {}),
    ...(parsed.data.utmSource ? { utmSource: parsed.data.utmSource } : {}),
    ...(parsed.data.utmMedium ? { utmMedium: parsed.data.utmMedium } : {}),
    ...(parsed.data.utmCampaign
      ? { utmCampaign: parsed.data.utmCampaign }
      : {}),
  };

  try {
    await provider.store(request);
    return successResponse;
  } catch (error) {
    if (error instanceof StorageUnavailableError) {
      return unavailableResponse();
    }

    return {
      status: 500,
      body: {
        ok: false,
        state: "error",
        message: siteContent.access.error,
      },
    };
  }
}

export function unavailableResponse(): AccessSubmissionResult {
  return {
    status: 503,
    body: {
      ok: false,
      state: "unavailable",
      message: siteContent.access.unavailable,
    },
  };
}
