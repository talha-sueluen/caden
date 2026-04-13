const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL   = 'claude-sonnet-4-20250514'

const SYSTEM_PROMPT =
  'You are a weekly planning assistant. Analyse the user\'s tasks, ' +
  'optionally use web search to better understand each one, then score difficulty and propose a balanced plan. ' +
  'Respond ONLY with valid JSON — no markdown, no text outside the JSON object.'

function buildPrompt(rawText) {
  return `Here are my tasks for the week:\n\n${rawText.trim()}\n\n` +
    'For every distinct task or to-do item:\n' +
    '1. Use web search if it helps you understand the task.\n' +
    '2. Assign difficulty: 1 = trivial, 2 = easy, 3 = medium, 4 = hard, 5 = very hard.\n' +
    '3. Write ONE justification sentence (max 12 words) for the score.\n' +
    '4. Distribute all tasks across Monday–Sunday so daily difficulty totals are roughly equal.\n\n' +
    'Respond with ONLY this JSON (no markdown fences, no extra text):\n' +
    '{\n' +
    '  "tasks": [\n' +
    '    { "title": "Exact task name", "difficulty": 3, "justification": "Short reason" }\n' +
    '  ],\n' +
    '  "plan": {\n' +
    '    "Monday": ["task title"],\n' +
    '    "Tuesday": [],\n' +
    '    "Wednesday": [],\n' +
    '    "Thursday": [],\n' +
    '    "Friday": [],\n' +
    '    "Saturday": [],\n' +
    '    "Sunday": []\n' +
    '  }\n' +
    '}\n\n' +
    'Every title in "plan" must exactly match a title in "tasks". Include all seven days even if empty.'
}

async function post(body, apiKey) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      // Required for direct browser access — user supplies their own key
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return { res, data }
}

function parseResponse(data) {
  const textBlock = (data.content ?? []).find(b => b.type === 'text')
  if (!textBlock?.text) throw new Error('empty_response')

  // Strip markdown code fences Claude sometimes wraps around JSON
  let json = textBlock.text.trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()

  let parsed
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('invalid_json')
  }

  if (!Array.isArray(parsed.tasks) || typeof parsed.plan !== 'object' || !parsed.plan) {
    throw new Error('invalid_structure')
  }

  // Normalise: ensure all seven days exist
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  for (const day of DAYS) {
    if (!Array.isArray(parsed.plan[day])) parsed.plan[day] = []
  }

  return parsed // { tasks: [{title, difficulty, justification}], plan: {Monday: [...], ...} }
}

/**
 * Call the Anthropic API to score tasks and build a weekly plan.
 *
 * Tries with the web_search_20250305 tool first; falls back to a plain call
 * if that tool is not available on the account / model.
 *
 * @param {string} rawText  Free-form user input
 * @param {string} apiKey   User's Anthropic API key from settings
 * @returns {{ tasks: Array, plan: Object }}
 */
export async function generateWeeklyPlan(rawText, apiKey) {
  const base = {
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPrompt(rawText) }],
  }

  // --- Attempt 1: with web search tool ---
  let { res, data } = await post(
    { ...base, tools: [{ type: 'web_search_20250305', name: 'web_search' }] },
    apiKey,
  )

  // If 400 and the error mentions the tool, retry without it
  if (!res.ok && res.status === 400) {
    const msg = (data?.error?.message ?? '').toLowerCase()
    if (msg.includes('tool') || msg.includes('web_search') || msg.includes('unknown')) {
      ;({ res, data } = await post(base, apiKey))
    }
  }

  if (!res.ok) {
    const err = new Error(data?.error?.type ?? 'api_error')
    err.status = res.status
    err.detail = data?.error?.message ?? ''
    throw err
  }

  return parseResponse(data)
}
