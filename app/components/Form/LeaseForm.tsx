"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const leaseSchema = z.object({
  leaseStartDate: z.string().nonempty({ message: "Start date is required" }),
  leaseEndDate: z.string().nonempty({ message: "End date is required" }),
  monthlyRent: z.number().min(0, { message: "Monthly rent must be positive" }),
  securityDeposit: z
    .number()
    .min(0, { message: "Security deposit must be positive" }),
  additionalCharges: z
    .number()
    .min(0, { message: "Additional charges must be positive" }),
  annualRentIncrease: z
    .number()
    .min(0)
    .max(100, { message: "Must be between 0 and 100" }),
  leaseType: z.enum(["residential", "commercial"], {
    message: "Select a valid lease type",
  }),
  maintenanceFee: z
    .number()
    .min(0, { message: "Maintenance fee must be positive" }),
  utilitiesIncluded: z.boolean(),
  ownerId: z.number().positive({ message: "Owner ID must be positive" }),
  latePaymentPenalty: z
    .number()
    .nonnegative({ message: "Penalty cannot be negative" }),
});

type LeaseFormData = z.infer<typeof leaseSchema>;

const LeaseInputForm: React.FC = () => {
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      leaseStartDate: "",
      leaseEndDate: "",
      monthlyRent: 0,
      securityDeposit: 0,
      additionalCharges: 0,
      annualRentIncrease: 0,
      leaseType: "residential",
      utilitiesIncluded: false,
      maintenanceFee: 0,
      latePaymentPenalty: 0,
      ownerId: 1,
    },
  });

  const calculateTotalCost = async () => {
    const values = getValues();
    const apiPayload = {
      startDate: values.leaseStartDate,
      endDate: values.leaseEndDate,
      monthlyRent: Number(values.monthlyRent), // Ensure numeric type
      securityDeposit: Number(values.securityDeposit),
      additionalCharges: Number(values.additionalCharges),
      annualIncrease: Number(values.annualRentIncrease),
      utilitiesIncluded: Boolean(values.utilitiesIncluded),
      maintenanceFees: Number(values.maintenanceFee),
      latePenalty: Number(values.latePaymentPenalty),
    };

    const res = await fetch("/api/leases/calculate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(apiPayload),
    });

    if (res.ok) {
      const data = await res.json();
      setTotalCost(data.totalCost);
    } else {
      console.error("Failed to calculate total cost");
    }
  };
  const router = useRouter();
  const { mutate: saveLease, isLoading } = useMutation({
    mutationFn: async (data: LeaseFormData) => {
      const response = await fetch("/api/leases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save lease data.");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Lease saved successfully!");
      router.push("/Dashboard");
    },
    onError: () => {
      toast.error("Failed to save lease.");
    },
  });

  const onSubmit = (data: LeaseFormData) => {
    console.log("Lease Data onSubmit:", data);
    saveLease(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lease Start Date */}
        <div>
          <label
            htmlFor="leaseStartDate"
            className="block font-medium text-gray-700"
          >
            Lease Start Date
          </label>
          <input
            id="leaseStartDate"
            type="date"
            {...register("leaseStartDate")}
            className="mt-2 w-full p-3 border bg-slate-300 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.leaseStartDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.leaseStartDate.message}
            </p>
          )}
        </div>

        {/* Lease End Date */}
        <div>
          <label
            htmlFor="leaseEndDate"
            className="block font-medium text-gray-700"
          >
            Lease End Date
          </label>
          <input
            id="leaseEndDate"
            type="date"
            {...register("leaseEndDate")}
            className="mt-2 w-full p-3 border bg-slate-300 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.leaseEndDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.leaseEndDate.message}
            </p>
          )}
        </div>

        {/* Monthly Rent */}
        <div>
          <label
            htmlFor="monthlyRent"
            className="block font-medium text-gray-700"
          >
            Monthly Rent Amount
          </label>
          <input
            id="monthlyRent"
            type="number"
            {...register("monthlyRent", { valueAsNumber: true })}
            className="mt-2 w-full p-3 bg-slate-300 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.monthlyRent && (
            <p className="text-red-500 text-sm mt-1">
              {errors.monthlyRent.message}
            </p>
          )}
        </div>

        {/* Security Deposit */}
        <div>
          <label
            htmlFor="securityDeposit"
            className="block font-medium text-gray-700"
          >
            Security Deposit
          </label>
          <input
            id="securityDeposit"
            type="number"
            {...register("securityDeposit", { valueAsNumber: true })}
            className="mt-2 w-full p-3 border bg-slate-300 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.securityDeposit && (
            <p className="text-red-500 text-sm mt-1">
              {errors.securityDeposit.message}
            </p>
          )}
        </div>

        {/* Additional Charges */}
        <div>
          <label
            htmlFor="additionalCharges"
            className="block font-medium text-gray-700"
          >
            Additional Charges
          </label>
          <input
            id="additionalCharges"
            type="number"
            {...register("additionalCharges", { valueAsNumber: true })}
            className="mt-2 w-full p-3 border bg-slate-300 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.additionalCharges && (
            <p className="text-red-500 text-sm mt-1">
              {errors.additionalCharges.message}
            </p>
          )}
        </div>

        {/* Lease Type */}
        <div>
          <label
            htmlFor="leaseType"
            className="block font-medium text-gray-700"
          >
            Lease Type
          </label>
          <select
            id="leaseType"
            {...register("leaseType")}
            className="mt-2 w-full bg-slate-300 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
          {errors.leaseType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.leaseType.message}
            </p>
          )}
        </div>
        {/* Maintenance Fee */}
        <div>
          <label
            htmlFor="maintenanceFee"
            className="block font-medium text-gray-700"
          >
            Maintenance Fee
          </label>
          <input
            id="maintenanceFee"
            type="number"
            {...register("maintenanceFee", { valueAsNumber: true })}
            className="mt-2 w-full p-3 border bg-slate-300 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.maintenanceFee && (
            <p className="text-red-500 text-sm mt-1">
              {errors.maintenanceFee.message}
            </p>
          )}
        </div>

        {/* Late Payment Penalty */}
        <div>
          <label
            htmlFor="latePaymentPenalty"
            className="block font-medium text-gray-700"
          >
            Late Payment Penalty
          </label>
          <input
            id="latePaymentPenalty"
            type="number"
            {...register("latePaymentPenalty", { valueAsNumber: true })}
            className="mt-2 w-full p-3 border bg-slate-300 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.latePaymentPenalty && (
            <p className="text-red-500 text-sm mt-1">
              {errors.latePaymentPenalty.message}
            </p>
          )}
        </div>
      </div>
      {/* Utilities Included Checkbox */}
      <div className="mb-4">
        <label
          htmlFor="utilitiesIncluded"
          className="block font-medium text-gray-700"
        >
          Utilities Included
        </label>
        <input
          id="utilitiesIncluded"
          type="checkbox"
          {...register("utilitiesIncluded")}
          className="ml-2"
        />
      </div>
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={calculateTotalCost}
      >
        Calculate Total Cost
      </button>
      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? "Saving Lease..." : "Save Lease"}
        </button>
      </div>
      {totalCost !== null && (
        <div className="mt-4">
          <h2 className="text-lg font-bold text-black">
            Total Lease Cost:{totalCost}
          </h2>
        </div>
      )}
    </form>
  );
};

export default LeaseInputForm;
