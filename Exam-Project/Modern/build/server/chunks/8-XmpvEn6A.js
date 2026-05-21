import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { p as prisma } from './db-DV7qvZ4L.js';
import '@prisma/client';

const load = async () => {
  const [users, roles, memberships] = await Promise.all([
    prisma.user.findMany({
      include: { role: true, membership: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.role.findMany(),
    prisma.membership.findMany()
  ]);
  return { users, roles, memberships };
};
const updateSchema = z.object({
  roleId: z.coerce.number().int().positive(),
  membershipId: z.coerce.number().int().positive()
});
const actions = {
  update: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const id = parseInt(data.id);
    const parsed = updateSchema.safeParse(data);
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message });
    await prisma.user.update({ where: { id }, data: parsed.data });
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BkPCppEa.js')).default;
const server_id = "src/routes/(admin)/users/+page.server.ts";
const imports = ["_app/immutable/nodes/8.ChsOXm3-.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/chunks/C59H_L-j.js","_app/immutable/chunks/BGWLZQkM.js","_app/immutable/chunks/HA4303Rl.js","_app/immutable/chunks/B-bvReI8.js"];
const stylesheets = ["_app/immutable/assets/8.DZR97qmA.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-XmpvEn6A.js.map
