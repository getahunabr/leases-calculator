import { SocketAddress } from "net";
import nodemailer from "nodemailer";
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface Transporter {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

export async function SendInviteEmail(
  email: string,
  inviteLink: string
): Promise<void> {
  const transporter: Transporter = {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "bfa22054bd769e",
      pass: "662ef54facf675",
    },
  };

  const mailOptions: MailOptions = {
    from: `"Lease Sharing" <gaberash887@gmail.com>`,
    to: email,
    subject: "Invitation to share a lease",
    text: `You have been invited to share a lease. Please click the link below to accept:\n\n${inviteLink}`,
    html: `<p>You have been invited to share a Lease. Click the link below to accept: </p><a href="${inviteLink}">${inviteLink}</a>`,
  };

  await nodemailer.createTransport(transporter).sendMail(mailOptions);
}
