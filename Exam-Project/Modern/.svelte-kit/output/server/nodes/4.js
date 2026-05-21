import * as server from '../entries/pages/(admin)/brands/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/brands/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/brands/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.nab1KCQj.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/chunks/C59H_L-j.js","_app/immutable/chunks/BGWLZQkM.js","_app/immutable/chunks/HA4303Rl.js","_app/immutable/chunks/B-bvReI8.js"];
export const stylesheets = ["_app/immutable/assets/4.DqSmiYOz.css"];
export const fonts = [];
