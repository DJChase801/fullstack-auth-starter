import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "../config/env.js";

const tokenPayloadSchema = z.object({
  sub: z.string().min(1),
});

export const sessionCookieName = "starter_session";

export function signAuthToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string) {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    return tokenPayloadSchema.parse(payload);
  } catch {
    return null;
  }
}
