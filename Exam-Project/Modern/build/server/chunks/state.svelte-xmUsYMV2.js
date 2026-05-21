import { o as onMount } from './ssr2-Dl-9NUvz.js';
import '@sveltejs/kit/internal/server';

const is_legacy = onMount.toString().includes("$$") || /function \w+\(\) \{\}/.test(onMount.toString());
const placeholder_url = "a:";
if (is_legacy) {
  ({
    url: new URL(placeholder_url)
  });
}
//# sourceMappingURL=state.svelte-xmUsYMV2.js.map
