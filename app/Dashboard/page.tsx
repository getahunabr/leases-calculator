"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import LeaseTable from "../components/LeaseTable";
import { useRouter } from "next/navigation";
import { useLeases } from "../hooks/UseLease";
const Dashboard = () => {
  const router = useRouter();

  // Use the custom hook to fetch leases
  const { data: leases, isLoading, isError, error } = useLeases();

  const handleLogout = () => {
    // Clear authentication data (localStorage, sessionStorage, or cookies)
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    router.push("/auth/login"); // Adjust to your login route
  };
  const handleInviteLease = () => {
    // Redirect to leases page
    router.push("/leases");
  };

  // useEffect(() => {
  //   const fetchLeases = async () => {
  //     try {
  //       const response = await axios.get("/api/getLeases");
  //       if (response.data) {
  //         setLeases(response.data);
  //       }
  //       setLoading(false);
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to load leases.");
  //       setLoading(false);
  //     }
  //   };

  //   fetchLeases();
  // }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Lease Management Dashboard
          </h1>

          <button
            onClick={handleInviteLease}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Invite Lease
          </button>
          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Leases Content */}
        {!isLoading && !isError && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700">Leases</h2>
              <p className="text-gray-600">
                Manage all active leases in one place.
              </p>
            </div>
            <LeaseTable leases={leases} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
