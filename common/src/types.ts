import { z } from "zod";

export const AddressJsonSchema = z.object({
  city: z.string(),
  county: z.string(),
  district: z.string(),
  municipality: z.string(),
  street: z.string(),
  type: z.string(),
  municipalityNumber: z.number(),
  postNumber: z.number(),
  typeCode: z.number()
});

export type AddressJson = z.infer<typeof AddressJsonSchema>;

export const AddressesJsonSchema = z.array(AddressJsonSchema);

export const AddressSchema = AddressJsonSchema.extend({
    $tsid: z.string().nonempty()
})

export type Address = z.infer<typeof AddressSchema>;

export const AddressesSchema = z.array(AddressSchema);
