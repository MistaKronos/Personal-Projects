// @ts-nocheck
import { fail } from '@sveltejs/kit'
import { z } from 'zod'
import { prisma } from '$lib/server/db'
import type { Actions, PageServerLoad } from './$types'

export const load = async () => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })
  return { categories }
}

const schema = z.object({ name: z.string().min(1, 'Name is required') })

export const actions = {
  create: async ({ request }: import('./$types').RequestEvent) => {
    const data = Object.fromEntries(await request.formData())
    const parsed = schema.safeParse(data)
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message })
    try {
      await prisma.category.create({ data: parsed.data })
    } catch {
      return fail(409, { error: 'Category name already exists.' })
    }
  },

  update: async ({ request }: import('./$types').RequestEvent) => {
    const data = Object.fromEntries(await request.formData())
    const id = parseInt(data.id as string)
    const parsed = schema.safeParse(data)
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message })
    await prisma.category.update({ where: { id }, data: parsed.data })
  },

  delete: async ({ request }: import('./$types').RequestEvent) => {
    const data = Object.fromEntries(await request.formData())
    const id = parseInt(data.id as string)
    try {
      await prisma.category.delete({ where: { id } })
    } catch {
      return fail(409, { error: 'Cannot delete category with associated products.' })
    }
  },
}
;null as any as PageServerLoad;;null as any as Actions;