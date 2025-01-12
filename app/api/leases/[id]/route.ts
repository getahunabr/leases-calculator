import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// DELETE request handler
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params; // Extract the 'id' from params

  try {
    // Attempt to delete the lease with the given id
    const lease = await prisma.lease.delete({
      where: { id: parseInt(id) }, // Ensure id is parsed to an integer
    });

    // Return a successful response with the deleted lease data
    return NextResponse.json(lease, { status: 200 });
  } catch (error) {
    console.error("Error during lease deletion:", error);

    // Return an error response if something goes wrong
    return NextResponse.json(
      { error: "Error deleting lease" },
      { status: 500 }
    );
  }
}

// Handle PUT request (Edit lease)
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params; // Extract the 'id' from params

  const data = await req.json(); // Parse incoming JSON data

  // Ensure leaseStartDate and leaseEndDate are in the correct ISO-8601 format
  const leaseStartDate = new Date(
    data.leaseStartDate + "T00:00:00Z"
  ).toISOString();
  const leaseEndDate = new Date(data.leaseEndDate + "T00:00:00Z").toISOString();

  // Convert numeric fields to floats
  const securityDeposit = parseFloat(data.securityDeposit);
  const monthlyRent = parseFloat(data.monthlyRent);
  const additionalCharges = parseFloat(data.additionalCharges);
  const annualRentIncrease = parseFloat(data.annualRentIncrease);
  const maintenanceFee = parseFloat(data.maintenanceFee);
  const latePaymentPenalty = parseFloat(data.latePaymentPenalty);

  try {
    // Perform the update using Prisma
    const updatedLease = await prisma.lease.update({
      where: { id: parseInt(id) }, // Use the dynamic 'id' to find the lease
      data: {
        leaseStartDate,
        leaseEndDate,
        securityDeposit,
        monthlyRent,
        additionalCharges,
        annualRentIncrease,
        maintenanceFee,
        latePaymentPenalty,
      },
    });

    console.log("Updated lease:", updatedLease);

    // Respond with the updated lease data
    return NextResponse.json(updatedLease, { status: 200 });
  } catch (error) {
    console.error("Error during lease update:", error);

    // Handle errors and return a 500 response
    return NextResponse.json(
      { error: "Error updating lease" },
      { status: 500 }
    );
  }
}
