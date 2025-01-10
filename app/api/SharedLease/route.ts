// import { prisma } from "@/app/_lib/Prisma";

// export async function POST(req: Request) {
//   const { leaseId, userId } = await req.json();

//   try {
//     // Create the shared lease in the database
//     const sharedLease = await prisma.sharedLease.create({
//       data: { leaseId, userId },
//     });

//     // Convert Prisma model instance to a plain object using JSON serialization
//     const plainSharedLease = JSON.parse(
//       JSON.stringify({
//         id: sharedLease.id,
//         leaseId: sharedLease.leaseId,
//         userId: sharedLease.userId,
//         createdAt: sharedLease.createdAt,
//         updatedAt: sharedLease.updatedAt,
//       })
//     );

//     return new Response(JSON.stringify(plainSharedLease), { status: 201 });
//   } catch (error) {
//     console.error("Error creating shared lease:", error);
//     return new Response("Error creating shared lease", { status: 500 });
//   }
// }
