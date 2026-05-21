import { jwtVerify, SignJWT } from 'jose';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");
async function signToken(payload) {
  return new SignJWT({ ...payload }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("2h").sign(secret());
}
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}

export { signToken as s, verifyToken as v };
//# sourceMappingURL=auth-Db4lQiPD.js.map
