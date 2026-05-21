// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'
import crypto from 'crypto'
import { signToken } from '$lib/server/auth'
import { prisma } from '$lib/server/db'
import type { Actions, PageServerLoad } from './$types'

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  if (locals.user) throw redirect(302, '/products')
  return {}
}

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

export const actions = {
  default: async ({ request, cookies }: import('./$types').RequestEvent) => {
    const raw = Object.fromEntries(await request.formData())
    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0].message })
    }

    const { email, password } = parsed.data
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    })

    if (!user || user.role.name !== 'Admin') {
      return fail(401, { error: 'Invalid credentials or insufficient permissions.' })
    }

    const hashed = crypto.pbkdf2Sync(password, user.salt, 310_000, 32, 'sha256').toString('hex')
    if (hashed !== user.hashedPassword) {
      return fail(401, { error: 'Invalid credentials or insufficient permissions.' })
    }

    const token = await signToken({ id: user.id, email: user.email, role: user.role.name })
    cookies.set('token', token, { httpOnly: true, maxAge: 7200, path: '/', sameSite: 'strict' })
    throw redirect(303, '/products')
  },
}
;null as any as Actions;