// // pages/api/leases/[id].ts
// import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function updateLeases( // Changed the function name
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { method, body } = req;

//   // Check for PUT request method
//   if (method === "PUT") {
//     try {
//       const { id } = req.query; // Assuming ID is passed through query parameters

//       // Ensure ID is a valid number
//       const leaseId = parseInt(id);
//       if (isNaN(leaseId)) {
//         return res
//           .status(400)
//           .json({ error: "Invalid lease ID (must be a number)" });
//       }

//       // Parse JSON data from request body
//       const data = await JSON.parse(body);

//       const updatedLease = await prisma.lease.update({
//         where: { id: leaseId },
//         data: {
//           leaseStartDate: data.leaseStartDate,
//           leaseEndDate: data.leaseEndDate,
//           securityDeposit: data.securityDeposit,
//           monthlyRent: data.monthlyRent,
//           additionalCharges: data.additionalCharges,
//           annualRentIncrease: data.annualRentIncrease,
//           maintenanceFee: data.maintenanceFee,
//           latePaymentPenalty: data.latePaymentPenalty,
//         },
//       });

//       res.status(200).json(updatedLease);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Error updating lease" });
//     }
//   } else {
//     // Handle other HTTP methods (optional)
//     res.setHeader("Allow", ["PUT"]);
//     res.status(405).end("Method Not Allowed");
//   }
// }
