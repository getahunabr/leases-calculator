// components/LeaseTable.tsx
"use client";

import { useLeases } from "../hooks/UseLease";
import axios from "axios";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState, useTransition } from "react";
import Spinner from "./Spinner";

interface Lease {
  id: string | null;
  leaseStartDate: string | Date;
  leaseEndDate: string | Date;
  securityDeposit: number;
  monthlyRent: number;
  additionalCharges: number;
  annualRentIncrease: number;
  maintenanceFee: number;
  latePaymentPenalty: number;
}
interface LeaseTableProps {
  lease: Lease[]; // Array of Lease objects
  setLeases: React.Dispatch<React.SetStateAction<Lease[]>>;
}
export default function LeaseTable({ lease }: LeaseTableProps) {
  const { isLoading, error, data: leases } = useLeases();
  const [editingLease, setEditingLease] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<Lease>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leaseToDelete, setLeaseToDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition(); // useTransition for UX
  const [shareModalLease, setShareModalLease] = useState<Lease | null>(null);
  const [emailToShare, setEmailToShare] = useState("");
  const queryClient = useQueryClient();

  // Handle changes to the input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle the "Edit" button click
  const handleEditClick = (lease: Lease) => {
    const formattedStartDate = toISODate(lease.leaseStartDate);
    const formattedEndDate = toISODate(lease.leaseEndDate);

    setEditingLease(lease.id); // Set the current lease as the one being edited
    setEditedData({
      leaseStartDate: formattedStartDate,
      leaseEndDate: formattedEndDate,
      securityDeposit: lease.securityDeposit,
      monthlyRent: lease.monthlyRent,
      additionalCharges: lease.additionalCharges,
      annualRentIncrease: lease.annualRentIncrease,
      maintenanceFee: lease.maintenanceFee,
      latePaymentPenalty: lease.latePaymentPenalty,
    });
  };
  console.log("Edited Data:", editedData);

  // Edit lease mutation
  const editLeaseMutation = useMutation({
    // mutationFn: Executes the mutation function
    mutationFn: async (editedLeaseData) => {
      const { id, data } = editedLeaseData;
      const response = await axios.put(`/api/leases/${id}`, data);
      return response.data;
    },
    // mutationKey: A unique key for this mutation
    mutationKey: ["editLease"], // Unique identifier
    onSuccess: (data) => {
      // Invalidate the leases query to refetch after editing
      queryClient.invalidateQueries(["leases"]);
      toast.success("Lease edited successfully!");
      console.log("Lease edited successfully:", data);
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      toast.error("Error editing lease: " + error.message);
      console.error("Error editing lease:", error);
    },
  });

  // Save edited lease
  const handleSaveEdit = async () => {
    const updatedLeaseData = {
      id: editingLease,
      data: {
        ...editedData,
        leaseStartDate: toISODate(editedData.leaseStartDate),
        leaseEndDate: toISODate(editedData.leaseEndDate),
      },
    };
    try {
      await editLeaseMutation.mutateAsync(updatedLeaseData);
      setEditingLease(null);
    } catch (err) {
      console.error("Error saving edited lease:", err);
    }
  };

  // Delete lease mutation
  const deleteLeaseMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/leases/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch the leases data after a successful deletion
      queryClient.invalidateQueries(["leases"]);
      toast.success("Lease deleted successfully!");
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error("Error deleting lease: " + error.message);
    },
  });

  // Optimistic UI for deleting a lease
  const deleteLease = async () => {
    startTransition(() => {
      deleteLeaseMutation.mutate(leaseToDelete);
    });
  };

  const toISODate = (date: string | Date | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  // // Cancel editing and revert to previous lease data
  const handleCancelEdit = () => {
    setEditingLease(null); // Reset the editing state
    setEditedData({}); // Clear the edited data
  };
  // Mutation for sharing lease
  const shareLeaseMutation = useMutation({
    mutationFn: async ({ leaseId, email }) => {
      const response = await axios.post(`/api/leases/${leaseId}/share`, {
        email,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["leases"]);
      toast.success("Lease shared successfully!");
      setEmailToShare("");
      setShareModalLease(null);
    },
    onError: (error) => {
      toast.error("Error sharing lease: " + error.message);
    },
  });
  // Open share modal
  const openShareModal = (lease) => {
    setShareModalLease(lease);
  };

  // Close share modal
  const closeShareModal = () => {
    setShareModalLease(null);
    setEmailToShare("");
  };

  ////////////////////////////////////////////////////////
  const handleShareLease = async () => {
    if (!emailToShare) {
      toast.error("Please enter an email to share the lease.");
      return;
    }

    // Check if the lease ID is available
    if (!shareModalLease?.id) {
      toast.error("Invalid lease data. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/leases/${shareModalLease.id}/share`,
        {
          email: emailToShare, // Removed userId
        }
      );

      // Check for a successful response
      if (response?.status === 200) {
        toast.success("Lease shared successfully!");
        setEmailToShare("");
        setShareModalLease(null);
      } else {
        const errorMessage = response?.data?.message || "Unknown error";
        toast.error(`Failed to share the lease: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(`Error sharing lease: ${errorMessage}`);
    }
  };

  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  // Open the delete modal
  const openDeleteModal = (leaseId) => {
    setLeaseToDelete(leaseId);
    setIsDeleteModalOpen(true);
  };

  // Close the delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLeaseToDelete(null);
  };

  const dateChanger = (date: string | Date): string => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Keep only the date part (YYYY-MM-DD)
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-sm rounded-lg">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="px-4 py-2 border border-gray-200">ID</th>
            <th className="px-4 py-2 border border-gray-200">Start Date</th>
            <th className="px-4 py-2 border border-gray-200">End Date</th>
            <th className="px-4 py-2 border border-gray-200">
              Security Deposit
            </th>
            <th className="px-4 py-2 border border-gray-200">Monthly Rent</th>
            <th className="px-4 py-2 border border-gray-200">
              Additional Charges
            </th>
            <th className="px-4 py-2 border border-gray-200">
              Annual Rent Increase
            </th>
            <th className="px-4 py-2 border border-gray-200">
              Maintenance Fees
            </th>
            <th className="px-4 py-2 border border-gray-200">
              Late Payment Penalty
            </th>
            <th className="px-4 py-2 border border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leases && leases.length > 0 ? (
            leases.map((lease: any) => (
              <tr key={lease.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {lease.id}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {dateChanger(lease.leaseStartDate)}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {dateChanger(lease.leaseEndDate)}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {lease.securityDeposit}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {lease.monthlyRent}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {lease.additionalCharges}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {lease.annualRentIncrease}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {lease.maintenanceFee}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {lease.latePaymentPenalty}
                </td>
                <td className="px-4 py-2 border border-gray-200 flex gap-2 justify-center items-center">
                  <button
                    onClick={() => handleEditClick(lease)}
                    className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(lease.id)}
                    className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openShareModal(lease)}
                    className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Share
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="px-4 py-2 text-center text-gray-500">
                No leases available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Edit Lease Modal */}
      {editingLease && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-w-lg">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Edit Lease
            </h2>

            {/* Grid layout for fields to make them side by side */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Start Date (Non-editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="leaseStartDate"
                  value={editedData.leaseStartDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-100  text-gray-600 border border-gray-300 rounded-md cursor-not-allowed"
                  disabled
                />
              </div>

              {/* End Date (Non-editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="leaseEndDate"
                  value={editedData.leaseEndDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-md cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            {/* Security Deposit and Monthly Rent side by side */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Security Deposit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Deposit
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={editedData.securityDeposit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Monthly Rent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rent
                </label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={editedData.monthlyRent}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Additional Charges and Annual Rent Increase side by side */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Additional Charges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Charges
                </label>
                <input
                  type="number"
                  name="additionalCharges"
                  value={editedData.additionalCharges}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Annual Rent Increase */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Rent Increase (%)
                </label>
                <input
                  type="number"
                  name="annualRentIncrease"
                  value={editedData.annualRentIncrease}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Maintenance Fee and Late Payment Penalty side by side */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Maintenance Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance Fee
                </label>
                <input
                  type="number"
                  name="maintenanceFee"
                  value={editedData.maintenanceFee}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Late Payment Penalty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Late Payment Penalty
                </label>
                <input
                  type="number"
                  name="latePaymentPenalty"
                  value={editedData.latePaymentPenalty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border bg-slate-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Button Section */}
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lease Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 max-w-lg">
            <h2 className="text-xl font-semibold text-center mb-4">
              Are you sure?
            </h2>
            <p className="text-sm text-center text-gray-700 mb-6">
              Are you sure you want to delete this lease? This action cannot be
              undone.
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteLease(leaseToDelete)} // Call delete function
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {shareModalLease && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 max-w-lg">
            <h2 className="text-xl font-semibold text-center mb-4">
              Share Lease: {shareModalLease.name}
            </h2>
            <input
              type="email"
              placeholder="Enter user email"
              value={emailToShare}
              onChange={(e) => setEmailToShare(e.target.value)}
              className="w-full px-4 py-2 mb-4 border bg-slate-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between gap-4">
              <button
                onClick={closeShareModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleShareLease}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
