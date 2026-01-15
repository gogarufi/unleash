import { env } from "../config.ts";
import { searchAddresses } from "../service.ts";
import { z } from "zod";
import type { Request, Response } from "express";

export const AddressSearchQuerySchema = z.object({
  q: z.string().trim().min(3).max(100),
});

export function address(req: Request, res: Response) {
  const result = AddressSearchQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      error: z.prettifyError(result.error),
    });
  }

  const { q } = result.data;

  return res.json(searchAddresses(q));
}

export function environment(_req: Request, res: Response) {
  return res.json({
    name: env.ENVIRONMENT,
  });
}
