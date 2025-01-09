"use client"; // Ensures this component runs client-side

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AcceptLease() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); // Token state to handle it safely
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Wait until router.query is defined and get the token safely
    if (router.query && router.query.token) {
      setToken(router.query.token as string);
    }
  }, [router.query]); // This ensures that the effect is triggered when router.query changes

  useEffect(() => {
    if (token) {
      const acceptInvite = async () => {
        try {
          const res = await fetch("/api/leases/accept", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (res.ok) {
            setMessage("You have successfully accepted the leases");
          } else {
            const error = await res.json();
            setMessage(`Error: ${error.error}`);
          }
        } catch (error) {
          setMessage("Error processing the invitation");
          console.error(error);
        }
      };

      acceptInvite(); // Call the function to handle invitation acceptance
    }
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Accept Lease Invitation</h1>
      <p>{message}</p>
    </div>
  );
}