import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number(),
  ENVIRONMENT: z.enum(["development", "production", "local"]),
  DATA_SOURCE: z.string(),
});

// This is going to throw an error on startup if the environment variables are not valid
const result = EnvSchema.safeParse(process.env);

if (!result.success) {
  throw Error(z.prettifyError(result.error));
}

export const env = result.data;
