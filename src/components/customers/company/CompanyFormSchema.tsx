
import * as z from 'zod';

export const companyFormSchema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  industry: z.string().default('real estate'),
  website: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zip: z.string().optional().or(z.literal(''))
});

export type CompanyFormSchema = z.infer<typeof companyFormSchema>;
export type CompanyFormData = z.infer<typeof companyFormSchema>;
