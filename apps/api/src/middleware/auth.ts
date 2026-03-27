import type { NextFunction, Request, Response } from "express";

import { verifyAuthToken, sessionCookieName } from "../lib/jwt.js";

export function attachAuth(request: Request, _response: Response, next: NextFunction) {
  const token = request.cookies?.[sessionCookieName];

  if (!token) {
    next();
    return;
  }

  const payload = verifyAuthToken(token);

  if (payload) {
    request.auth = { userId: payload.sub };
  }

  next();
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  if (!request.auth?.userId) {
    response.status(401).json({ message: "Authentication required." });
    return;
  }

  next();
}
