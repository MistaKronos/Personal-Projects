import { redirect } from '@sveltejs/kit';

const load = async ({ locals, url }) => {
  if (!locals.user) throw redirect(302, `/login`);
  return { user: locals.user };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-CMrXM2qR.js')).default;
const server_id = "src/routes/(admin)/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.CjcRl3bC.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/chunks/C59H_L-j.js","_app/immutable/chunks/BGWLZQkM.js","_app/immutable/chunks/Bzs54chs.js","_app/immutable/chunks/B-bvReI8.js","_app/immutable/chunks/HA4303Rl.js"];
const stylesheets = ["_app/immutable/assets/2.w38mXqBJ.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-Cq7Qvrln.js.map
