import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { p as prisma } from './db-DV7qvZ4L.js';
import '@prisma/client';

const load = async () => {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" }
  });
  return { brands };
};
const schema = z.object({ name: z.string().min(1, "Name is required") });
const actions = {
  create: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const parsed = schema.safeParse(data);
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message });
    try {
      await prisma.brand.create({ data: parsed.data });
    } catch {
      return fail(409, { error: "Brand name already exists." });
    }
  },
  update: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const id = parseInt(data.id);
    const parsed = schema.safeParse(data);
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message });
    await prisma.brand.update({ where: { id }, data: parsed.data });
  },
  delete: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const id = parseInt(data.id);
    try {
      await prisma.brand.delete({ where: { id } });
    } catch {
      return fail(409, { error: "Cannot delete brand with associated products." });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-T17zVihB.js')).default;
const server_id = "src/routes/(admin)/brands/+page.server.ts";
const imports = ["_app/immutable/nodes/4.nab1KCQj.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/chunks/C59H_L-j.js","_app/immutable/chunks/BGWLZQkM.js","_app/immutable/chunks/HA4303Rl.js","_app/immutable/chunks/B-bvReI8.js"];
const stylesheets = ["_app/immutable/assets/4.DqSmiYOz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-6TnZSi9h.js.map
