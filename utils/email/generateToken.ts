export function generateToken(leaseId, email) {
  return Buffer.from(`${leaseId}:${email}`).toString("base64");
}

export function decodeToken(token) {
  const decode = Buffer.from(token, "base64").toString("ascii");
  const [leaseId, email] = decode.split(":");
  return [leaseId, email];
}
