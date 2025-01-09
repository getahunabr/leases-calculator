// pages/api/leases.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const leases = await prisma.lease.findMany();
    return NextResponse.json(leases, { status: 200 });
  } catch (error) {
    console.error("Error fetching leases:", error);
    return NextResponse.json(
      { error: "Failed to fetch leases." },
      { status: 500 }
    );
  }
}
