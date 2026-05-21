import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { p as prisma } from "../../../../chunks/db.js";
const load = async () => {
  const [users, roles, memberships] = await Promise.all([
    prisma.user.findMany({
      include: { role: true, membership: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.role.findMany(),
    prisma.membership.findMany()
  ]);
  return { users, roles, memberships };
};
const updateSchema = z.object({
  roleId: z.coerce.number().int().positive(),
  membershipId: z.coerce.number().int().positive()
});
const actions = {
  update: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const id = parseInt(data.id);
    const parsed = updateSchema.safeParse(data);
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message });
    await prisma.user.update({ where: { id }, data: parsed.data });
  }
};
export {
  actions,
  load
};
