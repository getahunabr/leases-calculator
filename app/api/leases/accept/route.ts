import { decodeToken } from "@/utils/email/generateToken";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token } = req.body;

    //decode the token
    const [leaseId, email] = decodeToken(token);

    //check if the user exist
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: " user not found" }), {
        status: 404,
      });
    }
    //Add the shared lease
    const sharedLease = await prisma.sharedLease.create({
      data: {
        leaseId: parseInt(leaseId),
        userId: user.id,
        sharedWithId: user.id,
      },
    });
    return new Response(
      JSON.stringify({ message: "Lease shared successfully" })
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }));
  }
}
