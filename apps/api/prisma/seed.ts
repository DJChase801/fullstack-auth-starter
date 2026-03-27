import { MembershipRole } from "@prisma/client";

import { env } from "../src/config/env.js";
import { prisma } from "../src/db.js";
import { hashPassword } from "../src/lib/password.js";
import { slugify } from "../src/lib/slug.js";

async function main() {
  const email = env.SEED_OWNER_EMAIL.toLowerCase();
  const passwordHash = await hashPassword(env.SEED_OWNER_PASSWORD);
  const orgSlug = slugify(env.SEED_ORG_NAME);

  const organization = await prisma.organization.upsert({
    where: { slug: orgSlug },
    update: { name: env.SEED_ORG_NAME },
    create: {
      name: env.SEED_ORG_NAME,
      slug: orgSlug,
    },
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      fullName: env.SEED_OWNER_NAME,
      passwordHash,
    },
    create: {
      email,
      fullName: env.SEED_OWNER_NAME,
      passwordHash,
    },
  });

  await prisma.organizationMembership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: { role: MembershipRole.OWNER },
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: MembershipRole.OWNER,
    },
  });

  console.log(`Seeded owner ${email} in ${organization.name} (${organization.slug})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
