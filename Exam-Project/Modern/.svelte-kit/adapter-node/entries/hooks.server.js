import { v as verifyToken } from "../chunks/auth.js";
const handle = async ({ event, resolve }) => {
  const token = event.cookies.get("token");
  event.locals.user = token ? await verifyToken(token) : null;
  return resolve(event);
};
export {
  handle
};
