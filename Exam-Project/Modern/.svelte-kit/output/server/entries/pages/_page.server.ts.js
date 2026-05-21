import { redirect } from "@sveltejs/kit";
const load = async ({ locals }) => {
  if (locals.user) throw redirect(302, "/products");
  throw redirect(302, "/login");
};
export {
  load
};
