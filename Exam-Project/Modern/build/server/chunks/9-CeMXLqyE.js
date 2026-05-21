import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import crypto from 'crypto';
import { s as signToken } from './auth-Db4lQiPD.js';
import { p as prisma } from './db-DV7qvZ4L.js';
import 'jose';
import '@prisma/client';

const load = async ({ locals }) => {
  if (locals.user) throw redirect(302, "/products");
  return {};
};
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required")
});
const actions = {
  default: async ({ request, cookies }) => {
    const raw = Object.fromEntries(await request.formData());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0].message });
    }
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true }
    });
    if (!user || user.role.name !== "Admin") {
      return fail(401, { error: "Invalid credentials or insufficient permissions." });
    }
    const hashed = crypto.pbkdf2Sync(password, user.salt, 31e4, 32, "sha256").toString("hex");
    if (hashed !== user.hashedPassword) {
      return fail(401, { error: "Invalid credentials or insufficient permissions." });
    }
    const token = await signToken({ id: user.id, email: user.email, role: user.role.name });
    cookies.set("token", token, { httpOnly: true, maxAge: 7200, path: "/", sameSite: "strict" });
    throw redirect(303, "/products");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CJ7komxI.js')).default;
const server_id = "src/routes/login/+page.server.ts";
const imports = ["_app/immutable/nodes/9.D-QA9b5X.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/chunks/C59H_L-j.js","_app/immutable/chunks/HA4303Rl.js","_app/immutable/chunks/B-bvReI8.js"];
const stylesheets = ["_app/immutable/assets/9.DY4BzuyB.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-CeMXLqyE.js.map
