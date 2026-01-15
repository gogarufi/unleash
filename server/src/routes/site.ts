import type { Request, Response } from "express";
import path from 'node:path'

export function index(_req: Request, res: Response) {
  return res.sendFile("index.html", { root: path.resolve(import.meta.dirname, "../../../client/dist") });
}
