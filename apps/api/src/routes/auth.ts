import { MembershipRole, Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";

import { prisma } from "../db.js";
import { asyncHandler } from "../lib/async-handler.js";
import {
  authenticatedUserInclude,
  buildUniqueOrganizationSlug,
  findAuthenticatedUser,
  serializeAuthenticatedUser,
} from "../lib/auth-user.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { clearSessionCookie, setSessionCookie } from "../lib/session.js";
import { requireAuth } from "../middleware/auth.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  organizationName: z.string().trim().min(2).max(100),
});

export const authRouter = Router();

authRouter.post("/register", asyncHandler(async (request, response) => {
  const input = registerSchema.parse(request.body);
  const email = input.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    response.status(409).json({ message: "A user with that email already exists." });
    return;
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.$transaction(async (transactionClient: Prisma.TransactionClient) => {
    const slug = await buildUniqueOrganizationSlug(input.organizationName, transactionClient);

    return transactionClient.user.create({
      data: {
        email,
        fullName: input.fullName,
        passwordHash,
        memberships: {
          create: {
            role: MembershipRole.OWNER,
            organization: {
              create: {
                name: input.organizationName,
                slug,
              },
            },
          },
        },
      },
      include: authenticatedUserInclude,
    });
  });

  setSessionCookie(response, user.id);
  response.status(201).json({ user: serializeAuthenticatedUser(user) });
}));

authRouter.post("/login", asyncHandler(async (request, response) => {
  const input = loginSchema.parse(request.body);
  const email = input.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    include: authenticatedUserInclude,
  });

  if (!user) {
    response.status(401).json({ message: "Invalid email or password." });
    return;
  }

  const passwordMatches = await verifyPassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    response.status(401).json({ message: "Invalid email or password." });
    return;
  }

  setSessionCookie(response, user.id);
  response.json({ user: serializeAuthenticatedUser(user) });
}));

authRouter.post("/logout", (_request, response) => {
  clearSessionCookie(response);
  response.status(204).send();
});

authRouter.get("/me", requireAuth, asyncHandler(async (request, response) => {
  const user = await findAuthenticatedUser(request.auth!.userId);

  if (!user) {
    clearSessionCookie(response);
    response.status(401).json({ message: "Session expired." });
    return;
  }

  response.json({ user: serializeAuthenticatedUser(user) });
}));
