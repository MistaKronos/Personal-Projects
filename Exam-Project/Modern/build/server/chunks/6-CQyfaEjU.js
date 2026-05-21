import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { p as prisma } from './db-DV7qvZ4L.js';
import '@prisma/client';

const load = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      orderItems: { include: { product: { select: { name: true } } } }
    },
    orderBy: { createdAt: "desc" }
  });
  return { orders };
};
const statusSchema = z.object({
  status: z.enum(["Pending", "Processing", "Shipped", "Completed", "Cancelled"])
});
const actions = {
  updateStatus: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const id = parseInt(data.id);
    const parsed = statusSchema.safeParse(data);
    if (!parsed.success) return fail(400, { error: "Invalid status." });
    await prisma.order.update({ where: { id }, data: { status: parsed.data.status } });
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-AUTSEm6V.js')).default;
const server_id = "src/routes/(admin)/orders/+page.server.ts";
const imports = ["_app/immutable/nodes/6.CXI7OJND.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/chunks/C59H_L-j.js","_app/immutable/chunks/BGWLZQkM.js","_app/immutable/chunks/HA4303Rl.js","_app/immutable/chunks/B-bvReI8.js"];
const stylesheets = ["_app/immutable/assets/6.DfIwKQ8r.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-CQyfaEjU.js.map
