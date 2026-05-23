import { fail } from '@sveltejs/kit'
import { z } from 'zod'
import { prisma } from '$lib/server/db'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const brands = await prisma.brand.findMany({
    include: { products: { select: { id: true, name: true } }, _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })
  return { brands }
}

const schema = z.object({ name: z.string().min(1, 'Name is required') })

export const actions: Actions = {
  create: async ({ request }) => {
    const data = Object.fromEntries(await request.formData())
    const parsed = schema.safeParse(data)
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message })
    try {
      await prisma.brand.create({ data: parsed.data })
    } catch {
      return fail(409, { error: 'Brand name already exists.' })
    }
  },

  update: async ({ request }) => {
    const data = Object.fromEntries(await request.formData())
    const id = parseInt(data.id as string)
    const parsed = schema.safeParse(data)
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message })
    await prisma.brand.update({ where: { id }, data: parsed.data })
  },

  delete: async ({ request }) => {
    const data = Object.fromEntries(await request.formData())
    const id = parseInt(data.id as string)
    try {
      await prisma.brand.delete({ where: { id } })
    } catch {
      return fail(409, { error: 'Cannot delete brand with associated products.' })
    }
  },
}
