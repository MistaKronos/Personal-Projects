import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { p as prisma } from "../../../../chunks/db.js";
const load = async () => {
  const [products, brands, categories] = await Promise.all([
    prisma.product.findMany({
      include: { brand: true, category: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);
  return { products, brands, categories };
};
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().int().min(0),
  price: z.coerce.number().min(0),
  imageUrl: z.string().url().optional().or(z.literal("")),
  brandId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive()
});
const actions = {
  create: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const parsed = schema.safeParse(data);
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message });
    const { imageUrl, ...rest } = parsed.data;
    await prisma.product.create({ data: { ...rest, imageUrl: imageUrl || null } });
  },
  update: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const id = parseInt(data.id);
    const parsed = schema.safeParse(data);
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message });
    const { imageUrl, ...rest } = parsed.data;
    await prisma.product.update({ where: { id }, data: { ...rest, imageUrl: imageUrl || null } });
  },
  softDelete: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const id = parseInt(data.id);
    await prisma.product.update({ where: { id }, data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() } });
  },
  restore: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const id = parseInt(data.id);
    await prisma.product.update({ where: { id }, data: { isDeleted: false, deletedAt: null } });
  },
  hardDelete: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const id = parseInt(data.id);
    await prisma.product.delete({ where: { id } });
  }
};
export {
  actions,
  load
};
