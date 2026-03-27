import { type Prisma, type PrismaClient } from "@prisma/client";

import { prisma } from "../db.js";
import { slugify } from "./slug.js";

export const authenticatedUserInclude = {
  memberships: {
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },
} as const;

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function findAuthenticatedUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: authenticatedUserInclude,
  });
}

export type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof findAuthenticatedUser>>>;

export async function buildUniqueOrganizationSlug(
  organizationName: string,
  dbClient: DbClient = prisma,
) {
  const baseSlug = slugify(organizationName) || "organization";
  let candidateSlug = baseSlug;
  let suffix = 1;

  while (await dbClient.organization.findUnique({ where: { slug: candidateSlug } })) {
    candidateSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidateSlug;
}

export function serializeAuthenticatedUser(user: AuthenticatedUser) {
  const activeMembership = user.memberships[0] ?? null;

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    activeOrganizationId: activeMembership?.organizationId ?? null,
    organizations: user.memberships.map((membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      role: membership.role,
    })),
  };
}
