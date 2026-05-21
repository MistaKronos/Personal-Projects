import { fail } from '@sveltejs/kit'
import { z } from 'zod'
import { prisma } from '$lib/server/db'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      orderItems: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return { orders }
}

const statusSchema = z.object({
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']),
})

export const actions: Actions = {
  updateStatus: async ({ request }) => {
    const data = Object.fromEntries(await request.formData())
    const id = parseInt(data.id as string)
    const parsed = statusSchema.safeParse(data)
    if (!parsed.success) return fail(400, { error: 'Invalid status.' })
    await prisma.order.update({ where: { id }, data: { status: parsed.data.status } })
  },
}
