// Pure, dependency-free builder for the Gemini description prompt.
// No env, no network: unit-testable in isolation.

export interface DescriptionPromptOptions {
  title: string
  category?: string
  tags?: string[]
  keywords?: string[]
}

export function buildDescriptionPrompt(opts: DescriptionPromptOptions): string {
  const { title, category, tags, keywords } = opts

  const lines: string[] = [
    `You are an art curator. Write two descriptions for a digital artwork titled '${title}'.`,
  ]

  if (category) {
    const tagList = tags && tags.length > 0 ? tags.join(', ') : 'none'
    lines.push(
      `This artwork is in the '${category}' category, tagged: ${tagList}.`
    )
  }

  if (keywords && keywords.length > 0) {
    lines.push(
      `Naturally weave in one or two of these search phrases where they fit the artwork. Never force them, never list them, never repeat a phrase twice: ${keywords.join(
        ', '
      )}. Write for a person shopping for wall art, not for a search engine.`
    )
  }

  lines.push(
    `1. A 'short' catchy one-liner (max 15 words).`,
    `2. A 'long' engaging paragraph (approx 50-80 words) describing the visual style and mood.`,
    `Never use em dashes.`,
    `Return ONLY valid JSON format: { "short": "...", "long": "..." }`
  )

  return lines.join('\n')
}
