interface TokenData {
  leaseId: string;
  email: string;
}

export function generateToken(leaseId: string, email: string): string {
  return Buffer.from(`${leaseId}:${email}`).toString("base64");
}

export function decodeToken(token: string): [string, string] {
  const decode = Buffer.from(token, "base64").toString("ascii");
  const [leaseId, email] = decode.split(":");
  return [leaseId, email];
}
