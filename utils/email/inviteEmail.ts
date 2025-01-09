import { SocketAddress } from "net";
import nodemailer from "nodemailer";

//send an invitation email to share a lease
// @param {string} email The recipent email address
// @param {string} inviteLink The link to accep invitation
export async function SendInviteEmail(email: string, inviteLink) {
  const transporter = nodemailer.createTransport({
    // service: "gmail",
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "bfa22054bd769e",
      pass: "662ef54facf675",
    },
  });

  const mailOptions = {
    from: `"Lease Sharing" <gaberash887@gmail.com>`,
    to: email,
    subject: " Invitation to share a lease",
    text: "You have been invited to share a lease.please click  the link below  to accept:\n\n${invitelink}",
    html: `<p>You have been invited to share a Lease. click link below to accept: </p><a href="${inviteLink}">${inviteLink}</a>`,
  };
  await transporter.sendMail(mailOptions);
}
