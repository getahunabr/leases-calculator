// import { PrismaClient } from "@prisma/client";
// const Prisma = new PrismaClient();

// async function main() {
//   const user1 = await Prisma.user.create({
//     data: {
//       email: "owner@example.com",
//       name: "owner",
//       password: "securepassword",
//     },
//   });
//   const user2 = await Prisma.user.create({
//     data: {
//       email: "invitee@example.com",
//       name: "Invitee",
//       password: "securepassword",
//     },
//   });
//   await Prisma.lease.create({
//     data: {
//       leaseStartDate: new Date(),
//       leaseEndDate: new Date(
//         new Date().setFullYear(new Date().getFullYear() + 1)
//       ),
//       monthlyRent: 1000,
//       securityDeposit: 500,
//       ownerId: user1.id,
//       leaseType: "RESIDENTIAL",
//     },
//   });
//   main()
//     .catch((e) => console.error(e))
//     .finally(async () => {
//       await Prisma.$disconnect();
//     });
// }
