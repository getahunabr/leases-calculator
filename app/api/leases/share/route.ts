import { generateToken } from "@/utils/email/generateToken";
import { SendInviteEmail } from "@/utils/email/inviteEmail";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { leaseId, invitedEmail } = await req.json();

    // Validate the input
    if (!leaseId || !invitedEmail) {
      throw new Error("leaseId and invitedEmail are required");
    }

    console.log("Request received with:", { leaseId, invitedEmail });
    // Find the invited user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email: invitedEmail },
    });

    if (!invitedUser) {
      throw new Error("Invited user not found");
    }

    // Generate an invitation token
    const token = generateToken(leaseId, invitedEmail); // Ensure this function is defined and tested
    console.log("Generated token:", token);

    // Create a new invitation link
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/leases/accept?token=${token}`;
    console.log("Generated invite link:", inviteLink);

    // Send an email invitation
    await SendInviteEmail(invitedEmail, inviteLink);
    console.log("Invitation email sent to:", invitedEmail);

    return new Response(
      JSON.stringify({ message: "Invitation sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/leases/share:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send invitation" }),
      {
        status: 500,
      }
    );
  }
}
