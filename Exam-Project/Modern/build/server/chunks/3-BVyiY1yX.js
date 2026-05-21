import { redirect } from '@sveltejs/kit';

const load = async ({ locals }) => {
  if (locals.user) throw redirect(302, "/products");
  throw redirect(302, "/login");
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 3;
const server_id = "src/routes/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-BVyiY1yX.js.map
