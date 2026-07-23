import { z } from "zod";

import { interestValues, regionValues } from "../../content/site";

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional();

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.enum(values).optional(),
  );

export const accessRequestSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1)
      .max(254)
      .email()
      .transform((value) => value.toLowerCase()),
    name: optionalText(100),
    region: optionalEnum(regionValues),
    interest: optionalEnum(interestValues),
    invitationCode: optionalText(80),
    companyWebsite: z.string().trim().max(200).optional().default(""),
    referrer: optionalText(500),
    utmSource: optionalText(120),
    utmMedium: optionalText(120),
    utmCampaign: optionalText(120),
  })
  .strict();

export type AccessRequestInput = z.input<typeof accessRequestSchema>;
export type ValidatedAccessRequest = z.output<typeof accessRequestSchema>;

export type StoredAccessRequest = Omit<
  ValidatedAccessRequest,
  "companyWebsite"
>;
