const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const SYSTEM_PROMPT =
  'You are a weekly planning assistant. Analyse the user\'s tasks, ' +
  'then score difficulty and propose a balanced plan. ' +
  'Respond ONLY with valid JSON — no markdown, no text outside the JSON object.'

function buildPrompt(rawText) {
  return `Here are my tasks for the week:\n\n${rawText.trim()}\n\n` +
    'For every distinct task or to-do item:\n' +
    '1. Assign difficulty: 1 = trivial, 2 = easy, 3 = medium, 4 = hard, 5 = very hard.\n' +
    '2. Write ONE justification sentence (max 12 words) for the score.\n' +
    '3. Distribute all tasks across Monday–Sunday so daily difficulty totals are roughly equal.\n\n' +
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

async function post(rawText, apiKey) {
  const res = await fetch(`${API_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        { role: 'user', parts: [{ text: buildPrompt(rawText) }] },
      ],
      generationConfig: {
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    }),
  })
  const data = await res.json()
  return { res, data }
}

function parseResponse(data) {
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('empty_response')

  // Strip markdown code fences just in case
  let json = text.trim()
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
 * Call the Gemini API to score tasks and build a weekly plan.
 *
 * @param {string} rawText  Free-form user input
 * @param {string} apiKey   User's Gemini API key from settings
 * @returns {{ tasks: Array, plan: Object }}
 */
export async function generateWeeklyPlan(rawText, apiKey) {
  const { res, data } = await post(rawText, apiKey)

  if (!res.ok) {
    const status = data?.error?.code ?? res.status
    const message = data?.error?.status ?? data?.error?.message ?? 'api_error'
    const err = new Error(
      message === 'UNAUTHENTICATED' ? 'authentication_error' :
      message === 'RESOURCE_EXHAUSTED' ? 'rate_limit_error' :
      'api_error'
    )
    err.status = status === 'UNAUTHENTICATED' ? 401 : status === 'RESOURCE_EXHAUSTED' ? 429 : res.status
    err.detail = data?.error?.message ?? ''
    throw err
  }

  return parseResponse(data)
}
