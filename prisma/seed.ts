import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: { email: "owner@example.com", name: "owner" },
  });
  const user2 = await prisma.user.create({
    data: { email: "invitee@example.com", name: "Invitee" },
  });
  await prisma.lease.create({
    data: {
      startDate: new Date(),
      endDate: new Date(),
      monthlyRent: 1000,
      ownerId: user1.id,
    },
  });
  main()
    .catch((e) => console.error(e))
    .finally(async () => {
      await prisma.$disconnect();
    });
}
