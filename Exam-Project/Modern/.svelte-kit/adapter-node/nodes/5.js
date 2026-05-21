import * as server from '../entries/pages/(admin)/categories/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/categories/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/categories/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.BGKMdTB4.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/chunks/C59H_L-j.js","_app/immutable/chunks/BGWLZQkM.js","_app/immutable/chunks/HA4303Rl.js","_app/immutable/chunks/B-bvReI8.js"];
export const stylesheets = ["_app/immutable/assets/4.DqSmiYOz.css"];
export const fonts = [];
