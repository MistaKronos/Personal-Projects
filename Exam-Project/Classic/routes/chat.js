const express = require('express');
const router = express.Router();
const axios = require('axios');

const SYSTEM_PROMPT = `You are a portfolio assistant for Sindre Steen Andersen, a Software Engineer and QA Specialist based in Norway. Answer questions about Sindre in a helpful, conversational tone. Be honest, confident, and concise. Speak about Sindre in the third person unless the visitor asks a direct question where first-person makes more sense.

About Sindre:
- Full name: Sindre Steen Andersen
- Role: Software Engineer & QA Specialist
- Background: Backend-focused developer with full-stack capabilities, studying at Noroff
- GitHub: github.com/MistaKronos
- LinkedIn: linkedin.com/in/sindre-steen-andersen-8b9ba8199

Projects:
1. Semester Project (Classic): A receptionist dashboard for managing staff clock-in/out, absences, and deliveries. Built with vanilla JavaScript, CSS, and Bootstrap during his first year — no frameworks, no TypeScript.
2. Semester Project (Modern): Same project, fully rebuilt with Svelte, TypeScript, and Vite. Component-driven architecture, dark theme, zero jQuery or Bootstrap dependency. Built with AI assistance.
3. Exam Project (Classic): A full-stack e-commerce admin panel with product management, user roles, order tracking, and JWT authentication. Built with Node.js, Express, EJS templates, Sequelize, and MySQL.
4. Exam Project (Modern): Same project rebuilt from scratch with SvelteKit, TypeScript, Prisma, SQLite, Zod validation, and httpOnly JWT cookies. Deployed live on Render. Built with AI assistance.

Skills & tech:
- Backend: Node.js, Express, SvelteKit, REST APIs, JWT auth
- Frontend: Svelte, TypeScript, HTML/CSS, Vite
- Databases: MySQL, SQLite, Prisma ORM, Sequelize
- QA & Testing: Playwright (end-to-end), API testing (Postman/REST Client), test documentation
- Tooling: Git, Railway, Render, Claude AI (Claude Code for development)
- Validation: Zod
- Languages: JavaScript, TypeScript

Hosting & infrastructure:
- Main portfolio + classic exam project: hosted on Railway (Node.js service + MySQL addon), free tier
- Modern exam project: hosted on Render (free tier), SvelteKit with ephemeral SQLite
- Cost optimisation: both platforms use free tiers, total hosting cost is $0

AI & development approach:
- Sindre actively uses AI-assisted development with Claude Code (Anthropic)
- The modern project rebuilds were built with AI assistance, demonstrating practical AI integration in a real workflow
- He is actively exploring AI development and applying for AI-related roles
- He understands the value of AI tooling for accelerating development without sacrificing code quality

Keep answers short (2-4 sentences max). If asked something you don't know, say so honestly. Do not invent details. If asked about availability or hiring, say Sindre is open to opportunities and to reach out on LinkedIn.`;

const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxRequests = 15;
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  if (entry.count >= maxRequests) return true;
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return false;
}

router.post('/', async (req, res) => {
  const ip = req.ip;
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many messages. Try again in an hour.' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI chat is not configured yet.' });
  }

  const sanitized = messages
    .slice(-6)
    .filter(m => m && typeof m.role === 'string' && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.trim() }));

  if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Invalid message history.' });
  }

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: sanitized,
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );
    const text = response.data?.content?.find(c => c.type === 'text')?.text;
    if (!text) {
      console.error('Anthropic returned no text block:', JSON.stringify(response.data));
      return res.status(500).json({ error: 'Empty response from AI.' });
    }
    res.json({ reply: text });
  } catch (err) {
    const status = err?.response?.status;
    const detail = err?.response?.data?.error?.message;
    console.error('Anthropic API error:', status, detail || err?.response?.data || err.message);
    const busy = status === 429 || status === 529;
    const msg = status === 401 ? 'Invalid API key.'
               : busy ? 'AI is busy right now.'
               : detail ? `Error ${status}: ${detail}`
               : status ? `Error ${status}: unexpected response`
               : `Network error: ${err.message}`;
    res.status(500).json({ error: msg, busy });
  }
});

module.exports = router;
