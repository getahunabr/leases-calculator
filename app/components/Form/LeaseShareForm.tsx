"use client";
import { useState } from "react";

interface LeaseShareFormProps {
  leaseId: string;
}

export default function LeaseShareForm({ leaseId }: LeaseShareFormProps) {
  const [invitedEmail, setInvitedEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    console.log("Sending request with:", { leaseId, invitedEmail });
    const res = await fetch("/api/leases/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leaseId,
        invitedEmail,
      }),
    });
    if (res.ok) {
      setMessage("Invitation sent  successfully!");
      setInvitedEmail("");
    } else {
      const error = await res.json();
      setMessage(`Error: ${error.error}`);
    }
  };
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2"> share Lease</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Invitee's email"
          value={invitedEmail}
          onChange={(e) => setInvitedEmail(e.target.value)}
          className="border p-2 w-full mb-2 bg-slate-300"
          required
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Share Lease
        </button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
