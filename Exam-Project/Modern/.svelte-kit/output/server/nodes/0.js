

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BqTSBjuw.js","_app/immutable/chunks/CX_fMh_9.js","_app/immutable/chunks/C59H_L-j.js"];
export const stylesheets = ["_app/immutable/assets/0.gxKmVNvE.css"];
export const fonts = [];
