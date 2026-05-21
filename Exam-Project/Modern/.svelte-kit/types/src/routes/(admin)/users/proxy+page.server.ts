// @ts-nocheck
import { fail } from '@sveltejs/kit'
import { z } from 'zod'
import { prisma } from '$lib/server/db'
import type { Actions, PageServerLoad } from './$types'

export const load = async () => {
  const [users, roles, memberships] = await Promise.all([
    prisma.user.findMany({
      include: { role: true, membership: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.role.findMany(),
    prisma.membership.findMany(),
  ])
  return { users, roles, memberships }
}

const updateSchema = z.object({
  roleId:       z.coerce.number().int().positive(),
  membershipId: z.coerce.number().int().positive(),
})

export const actions = {
  update: async ({ request }: import('./$types').RequestEvent) => {
    const data = Object.fromEntries(await request.formData())
    const id = parseInt(data.id as string)
    const parsed = updateSchema.safeParse(data)
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message })
    await prisma.user.update({ where: { id }, data: parsed.data })
  },
}
;null as any as PageServerLoad;;null as any as Actions;