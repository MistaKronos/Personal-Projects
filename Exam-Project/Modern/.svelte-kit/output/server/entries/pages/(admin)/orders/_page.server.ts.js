import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { p as prisma } from "../../../../chunks/db.js";
const load = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      orderItems: { include: { product: { select: { name: true } } } }
    },
    orderBy: { createdAt: "desc" }
  });
  return { orders };
};
const statusSchema = z.object({
  status: z.enum(["Pending", "Processing", "Shipped", "Completed", "Cancelled"])
});
const actions = {
  updateStatus: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const id = parseInt(data.id);
    const parsed = statusSchema.safeParse(data);
    if (!parsed.success) return fail(400, { error: "Invalid status." });
    await prisma.order.update({ where: { id }, data: { status: parsed.data.status } });
  }
};
export {
  actions,
  load
};
