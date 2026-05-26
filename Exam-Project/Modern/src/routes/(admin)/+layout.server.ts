import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, setHeaders }) => {
  if (!locals.user) throw redirect(302, `/login`)
  setHeaders({ 'Cache-Control': 'no-store' })
  return { user: locals.user }
}
