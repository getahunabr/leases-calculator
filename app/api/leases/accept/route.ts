import { decodeToken } from "@/utils/email/generateToken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { token } = await req.json();

    //decode the token
    const { leaseId, email } = decodeToken(token);

    //check if the user exist
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: " user not found" }), {
        status: 404,
      });
    }
    //Add the shared lease
    //create a shared lease entry
    const sharedLease = await prisma.sharedLease.create({
      data: { leaseId: parseInt(leaseId), sharedWithId: user.id },
    });
    return new Response(
      JSON.stringify({ message: "Lease shared successfully" })
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }));
  }
}
