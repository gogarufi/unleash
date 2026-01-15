import express from "express";
import helmet from 'helmet';
import * as api from "./routes/api.ts";
import * as site from "./routes/site.ts";
import { env } from "./config.ts";
import { loadAddresses } from "./service.ts";
import pino from "pino-http";
import path from 'node:path';

await loadAddresses();

export const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true
    },
  }),
);

app.use(pino.default({
  level: env.ENVIRONMENT === "production" ? "warn" : "info",
  genReqId: (req) => req.headers['X-Request-ID'] ?? crypto.randomUUID()
}));

app.get("/api/environment", api.environment);
app.get("/api/address", api.address);

if (env.ENVIRONMENT !== "local") {
  app.use(express.static(path.resolve(import.meta.dirname, "../../client/dist")));
  app.get("/*splat", site.index);
}
