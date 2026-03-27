import { existsSync } from "node:fs";
import path from "node:path";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

import { env } from "./config/env.js";
import { attachAuth } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";

const app = express();
const clientIndexPath = path.resolve(process.cwd(), "public/index.html");

if (env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    }),
  );
}

app.use(express.json());
app.use(cookieParser());
app.use(attachAuth);

app.use("/api/health", healthRouter);
app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);

app.get("*", (request, response, next) => {
  if (request.path.startsWith("/api")) {
    next();
    return;
  }

  if (!request.accepts("html") || !existsSync(clientIndexPath)) {
    next();
    return;
  }

  response.sendFile(clientIndexPath);
});

app.use((_request, response) => {
  response.status(404).json({ message: "Not found." });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Validation error.",
      issues: error.flatten(),
    });
    return;
  }

  if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
    response.status(409).json({
      message: "A record with one of those values already exists.",
    });
    return;
  }

  console.error(error);
  response.status(500).json({ message: "Internal server error." });
});

export { app };
export default app;
