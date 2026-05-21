import * as server from '../entries/pages/(admin)/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.CjcRl3bC.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/chunks/C59H_L-j.js","_app/immutable/chunks/BGWLZQkM.js","_app/immutable/chunks/Bzs54chs.js","_app/immutable/chunks/B-bvReI8.js","_app/immutable/chunks/HA4303Rl.js"];
export const stylesheets = ["_app/immutable/assets/2.w38mXqBJ.css"];
export const fonts = [];
