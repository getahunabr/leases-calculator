import { PrismaClient } from "@prisma/client";
import LeaseShareForm from "../components/Form/LeaseShareForm";

const prisma = new PrismaClient();

export default async function LeasePage() {
  const leases = await prisma.lease.findMany({
    include: {
      owner: true,
      sharedLeases: {
        include: {
          sharedWith: true,
        },
      },
    },
  });
  console.log(leases);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Your Lease
      </h1>

      {leases.map((lease) => (
        <div
          key={lease.id}
          className="bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-6 transition-transform transform hover:scale-105 hover:shadow-xl"
        >
          <p className="text-lg font-medium text-gray-700">
            <strong>Lease ID:</strong> {lease.id}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Owner:</strong>
            {lease.owner ? (
              lease.owner.email
            ) : (
              <span className="text-gray-500">No owner assigned</span>
            )}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Start Date:</strong>{" "}
            {new Date(lease.startDate).toLocaleString()}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>End Date:</strong>{" "}
            {new Date(lease.leaseEndDate).toLocaleString()}
          </p>

          <div className="mt-4">
            <strong className="text-lg text-gray-700">Shared with:</strong>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {lease.sharedLeases.map((sharedLease) => (
                <li key={sharedLease.id} className="text-gray-700">
                  {sharedLease.sharedWith.email}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <LeaseShareForm leaseId={lease.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
