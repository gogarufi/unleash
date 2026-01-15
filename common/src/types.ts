import { z } from "zod";

export const AddressSchema = z.object({
  city: z.string(),
  county: z.string(),
  district: z.string(),
  municipality: z.string(),
  street: z.string(),
  type: z.string(),
  municipalityNumber: z.number(),
  postNumber: z.number(),
  typeCode: z.number(),
  $tsid: z.string().optional(),
});

export type Address = z.infer<typeof AddressSchema>;

export const AddressesSchema = z.array(AddressSchema);
