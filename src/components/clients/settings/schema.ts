
import * as z from "zod";

export const downloadSettingsFormSchema = z.object({
  contentLocked: z.boolean().default(true),
  enableCreditLimit: z.boolean().default(false),
  creditLimit: z.string().optional(),
  paymentTerms: z.enum(["onDelivery", "14days", "30days"]).default("onDelivery"),
});

export type DownloadSettingsFormValues = z.infer<typeof downloadSettingsFormSchema>;
