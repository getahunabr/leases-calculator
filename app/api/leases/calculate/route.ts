import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface LeaseRequestBody {
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  additionalCharges: number;
  annualIncrease: number;
  leaseType: string;
  utilitiesIncluded: boolean;
  maintenanceFees: number;
  latePenalty: number;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const {
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      additionalCharges,
      annualIncrease,
      leaseType,
      utilitiesIncluded,
      maintenanceFees,
      latePenalty,
    }: LeaseRequestBody = await req.json();
    console.log("Request Body:", {
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      additionalCharges,
      annualIncrease,
      leaseType,
      utilitiesIncluded,
      maintenanceFees,
      latePenalty,
    });

    // Calculate the duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const leaseDurationInDays =
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24); // Convert to days
    console.log("Lease Duration in Days:", leaseDurationInDays);

    // Calculate rent for partial month
    const daysInMonth = 30; // Assuming 30 days in a month
    const rentForPartialMonth =
      (monthlyRent / daysInMonth) * leaseDurationInDays;
    console.log("Rent for Partial Month:", rentForPartialMonth);

    // Calculate maintenance fees for the partial month
    const maintenanceFeesForPartialMonth =
      (maintenanceFees / daysInMonth) * leaseDurationInDays;
    console.log(
      "Maintenance Fees for Partial Month:",
      maintenanceFeesForPartialMonth
    );

    // Calculate the number of months between start and end dates (full months)
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    console.log("Full Months:", months);

    // If the lease duration is less than a full month, adjust months
    const isPartialMonth = leaseDurationInDays < daysInMonth;
    let totalRent = 0;

    // Calculate total rent for the full months
    for (let i = 0; i < months; i++) {
      const year = Math.floor(i / 12);
      const adjustedRent =
        monthlyRent * Math.pow(1 + annualIncrease / 100, year);
      totalRent += adjustedRent;
    }

    // Include rent for the partial month if applicable
    if (isPartialMonth) {
      totalRent += rentForPartialMonth;
    }

    console.log("Total Rent after loop (including partial month):", totalRent);

    // Calculate maintenance fees for all months (including partial month)
    let totalMaintenanceFees = maintenanceFees * months;
    if (isPartialMonth) {
      // Add maintenance fees for the partial month
      totalMaintenanceFees += maintenanceFeesForPartialMonth;
    }
    console.log("Total Maintenance Fees:", totalMaintenanceFees);

    // Calculate total cost
    const totalCost =
      totalRent +
      securityDeposit +
      additionalCharges +
      totalMaintenanceFees + // Add total maintenance fees
      (utilitiesIncluded ? 0 : latePenalty);

    const roundedTotalCost = Math.floor(totalCost);
    console.log("Total Cost:", roundedTotalCost);
    return new Response(JSON.stringify({ totalCost: roundedTotalCost }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
