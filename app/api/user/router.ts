// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(req: Request) {
//   try {
//     // Fetch the logged-in user (example email used here)
//     const user = await prisma.user.findFirst({
//       where: { email: "user@example.com" },
//     });

//     if (!user) {
//       return new Response(JSON.stringify({ message: "User not found" }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // Convert the Prisma model instance to a plain JavaScript object using JSON serialization
//     const plainUser = JSON.parse(
//       JSON.stringify({
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt,
//       })
//     );

//     return new Response(JSON.stringify(plainUser), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return new Response(JSON.stringify({ message: "Internal Server Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   } finally {
//     await prisma.$disconnect(); // Clean up Prisma resources
//   }
// }
