import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle POST requests
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request Body:", body); // Log the request body for debugging

    // Ensure leaseStartDate and leaseEndDate are Date objects
    const leaseStartDate = new Date(body.leaseStartDate);
    const leaseEndDate = new Date(body.leaseEndDate);

    if (isNaN(leaseStartDate.getTime()) || isNaN(leaseEndDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const lease = await prisma.lease.create({
      data: {
        leaseStartDate,
        leaseEndDate,
        monthlyRent: body.monthlyRent,
        securityDeposit: body.securityDeposit,
        additionalCharges: body.additionalCharges,
        annualRentIncrease: body.annualRentIncrease,
        leaseType: body.leaseType,
        maintenanceFee: body.maintenanceFee,
        utilitiesIncluded: body.utilitiesIncluded,
        latePaymentPenalty: body.latePaymentPenalty,
        startDate: new Date(),
        ownerId: body.ownerId,
      },
    });

    console.log("Request Body:", lease);
    return NextResponse.json({ lease }, { status: 201 });
  } catch (error) {
    console.error("Error creating lease:", error);
    return NextResponse.json(
      { error: "Failed to save lease. Please check your input data." },
      { status: 500 }
    );
  }
}
