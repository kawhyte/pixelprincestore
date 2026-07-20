// Pure, unit-testable validation for Sanity `description` rewrites (PLAN-27).
// Lives in lib/ (not inline in the draft script) so the em-dash / adjective-soup
// rules have real test coverage. Gemini ignores prompt rules often enough that
// the validator, not the prompt, is the actual guard.
// (This file references the em dash via the \u2014 escape, never the literal
// character, to satisfy the no-em-dash.test.ts source scan.)

const BANNED = [
  '\u2014' /* em dash */,
  'captivating',
  'vibrant',
  'elevate',
  'stunning',
  'seamless',
  'curated',
  'modern living',
  'perfect for',
  'delve',
  'timeless',
  'breathtaking',
  'must-have',
  'transform your',
]

export interface DescriptionCheck {
  ok: boolean
  problems: string[]
}

/** 1 to 2 sentences, <= 200 chars (schema limit), no banned phrases, no em dash. */
export function checkDescription(text: string): DescriptionCheck {
  const problems: string[] = []
  const trimmed = text.trim()
  if (trimmed.length === 0) problems.push('empty')
  if (trimmed.length > 200)
    problems.push(`too long (${trimmed.length} > 200 chars, Sanity schema limit)`)
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  if (sentences.length > 2) problems.push(`too many sentences (${sentences.length} > 2)`)
  for (const phrase of BANNED) {
    if (trimmed.toLowerCase().includes(phrase.toLowerCase()))
      problems.push(`banned phrase: "${phrase}"`)
  }
  return { ok: problems.length === 0, problems }
}
