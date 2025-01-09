import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Lease ID from route params

  if (!id) {
    return NextResponse.json(
      { message: "Lease ID is required" },
      { status: 400 }
    );
  }

  const { email } = await req.json(); // Only require email from the request body

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    // Check if the lease exists
    const lease = await prisma.lease.findUnique({
      where: { id: parseInt(id) },
    });

    if (!lease) {
      return NextResponse.json({ message: "Lease not found" }, { status: 404 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create a new entry in the SharedLease table
    const sharedLease = await prisma.sharedLease.create({
      data: {
        lease: {
          connect: { id: parseInt(id) }, // Connect the lease by its ID
        },
        user: {
          connect: { id: user.id }, // Connect the user (not userId)
        },
        sharedWith: {
          connect: { id: user.id }, // Connect the sharedWith user by their ID
        },
      },
    });

    return NextResponse.json(sharedLease, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
