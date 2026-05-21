import { c as create_ssr_component, f as subscribe, b as escape } from './ssr-paCmgf7M.js';
import { p as page } from './stores-CFWwcGrq.js';
import '@sveltejs/kit/internal';
import './ssr2-Dl-9NUvz.js';
import '@sveltejs/kit/internal/server';
import './state.svelte-xmUsYMV2.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});

export { Error as default };
//# sourceMappingURL=error.svelte-BhokGGRB.js.map
