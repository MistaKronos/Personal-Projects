import { redirect } from "@sveltejs/kit";
const POST = async ({ cookies }) => {
  cookies.delete("token", { path: "/" });
  throw redirect(303, "/login");
};
export {
  POST
};
