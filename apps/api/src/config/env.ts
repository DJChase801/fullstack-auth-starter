import { existsSync } from "node:fs";
import path from "node:path";

import dotenv from "dotenv";
import { z } from "zod";

const workspaceEnvPath = path.resolve(process.cwd(), "../../.env");
const localEnvPath = path.resolve(process.cwd(), ".env");

dotenv.config({
  path: existsSync(workspaceEnvPath) ? workspaceEnvPath : localEnvPath,
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((value) => value === "true"),
  SEED_OWNER_EMAIL: z.string().email().default("owner@example.com"),
  SEED_OWNER_PASSWORD: z.string().min(8).default("ChangeMe123!"),
  SEED_OWNER_NAME: z.string().min(2).default("Starter Owner"),
  SEED_ORG_NAME: z.string().min(2).default("Starter Organization"),
});

export const env = envSchema.parse(process.env);
