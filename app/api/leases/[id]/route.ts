import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
// Handle DELETE request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const lease = await prisma.lease.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(lease, { status: 200 });
  } catch (error) {
    console.error("Error during lease update:", error);
    return NextResponse.json(
      { error: "Error deleting lease" },
      { status: 500 }
    );
  }
}

// Handle PUT request (Edit lease)

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params; // Extract the 'id' from the context.params

  const data = await request.json(); // Parse incoming JSON body

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
    // Perform the update with Prisma
    const updatedLease = await prisma.lease.update({
      where: { id: parseInt(id) }, // Use id to find the lease to update
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

    return NextResponse.json(updatedLease, { status: 200 }); // Respond with the updated lease data
  } catch (error) {
    console.error("Error during lease update:", error);
    return NextResponse.json(
      { error: "Error updating lease" },
      { status: 500 }
    ); // Return an error response if something goes wrong
  }
}
