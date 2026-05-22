import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import Anthropic from '@anthropic-ai/sdk'

export const POST: RequestHandler = async ({ request }) => {
  const { name, brand, category } = await request.json()

  if (!name?.trim()) {
    return json({ error: 'Product name is required.' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return json({ error: 'AI not configured on this server.' }, { status: 503 })
  }

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `Write a concise e-commerce product description (1–2 sentences, max 80 words) for:

Product: ${name}
Brand: ${brand || 'Unknown'}
Category: ${category || 'General'}

Return only the description text, no quotes, no label.`
      }]
    })

    const description = (response.content[0] as { text: string }).text.trim()
    return json({ description })
  } catch (err) {
    console.error('Anthropic error:', err)
    return json({ error: 'AI generation failed. Try again.' }, { status: 500 })
  }
}
