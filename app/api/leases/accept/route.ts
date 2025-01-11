import { decodeToken } from "@/utils/email/generateToken";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server"; // Correct import for response
const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Corrected type for the request object
  try {
    // Parse the token from the request body
    const { token } = await req.json();

    // Decode the token
    const [leaseId, email] = decodeToken(token);

    // Ensure leaseId is a valid number
    const parsedLeaseId = parseInt(leaseId, 10);

    if (isNaN(parsedLeaseId)) {
      return NextResponse.json({ error: "Invalid lease ID" }, { status: 400 });
    }

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add the shared lease by creating an entry in the sharedLease table
    const sharedLease = await prisma.sharedLease.create({
      data: {
        leaseId: parsedLeaseId,
        userId: user.id,
        sharedWithId: user.id,
      },
    });

    // Return a success message
    return NextResponse.json(
      { message: "Lease shared successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Handle the error gracefully
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Invalid or expired token", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
