import { prisma } from "@/app/_lib/Prisma";
import { NextRequest, NextResponse } from "next/server";

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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await req.json();
  // Ensure leaseStartDate and leaseEndDate are in the correct ISO-8601 format
  const leaseStartDate = new Date(
    data.leaseStartDate + "T00:00:00Z"
  ).toISOString();
  const leaseEndDate = new Date(data.leaseEndDate + "T00:00:00Z").toISOString();
  // Convert `securityDeposit` to a Float
  const securityDeposit = parseFloat(data.securityDeposit);
  const monthlyRent = parseFloat(data.monthlyRent);
  const additionalCharges = parseFloat(data.additionalCharges);
  const annualRentIncrease = parseFloat(data.annualRentIncrease);
  const maintenanceFee = parseFloat(data.maintenanceFee);
  const latePaymentPenalty = parseFloat(data.latePaymentPenalty);
  try {
    const updatedLease = await prisma.lease.update({
      where: { id: parseInt(id) },
      data: {
        leaseStartDate: leaseStartDate,
        leaseEndDate: leaseEndDate,
        securityDeposit: securityDeposit,
        monthlyRent: monthlyRent,
        additionalCharges: additionalCharges,
        annualRentIncrease: annualRentIncrease,
        maintenanceFee: maintenanceFee,
        latePaymentPenalty: latePaymentPenalty,
      },
    });
    console.log("Updated lease:", updatedLease);
    return NextResponse.json(updatedLease, { status: 200 });
  } catch (error) {
    console.error("Error during lease update:", error);
    return NextResponse.json(
      { error: "Error updating lease" },
      { status: 500 }
    );
  }
}
