import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

import { env } from "./config/env.js";
import { prisma } from "./db.js";
import { attachAuth } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(attachAuth);

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

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

const server = app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});
