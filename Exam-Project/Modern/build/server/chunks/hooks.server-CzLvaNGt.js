import { v as verifyToken } from './auth-Db4lQiPD.js';
import 'jose';

const handle = async ({ event, resolve }) => {
  const token = event.cookies.get("token");
  event.locals.user = token ? await verifyToken(token) : null;
  return resolve(event);
};

export { handle };
//# sourceMappingURL=hooks.server-CzLvaNGt.js.map
