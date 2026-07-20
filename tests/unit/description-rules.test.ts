import { describe, it, expect } from 'vitest'
import { checkDescription } from '@/lib/description-rules'

describe('checkDescription', () => {
  it('passes a good 1-sentence description', () => {
    const result = checkDescription('A pixel-art map of Middle-earth for your game room wall.')
    expect(result.ok).toBe(true)
    expect(result.problems).toEqual([])
  })

  it('passes a good 2-sentence description', () => {
    const result = checkDescription(
      'A pixel-art world map in muted greens. Print it big for the office or the hallway.'
    )
    expect(result.ok).toBe(true)
    expect(result.problems).toEqual([])
  })

  it('fails on an em dash', () => {
    const result = checkDescription('A pixel map — bold and clean.')
    expect(result.ok).toBe(false)
    expect(result.problems.some((p) => p.includes('—'))).toBe(true)
  })

  it('fails on a banned phrase', () => {
    const result = checkDescription('A captivating pixel map for your wall.')
    expect(result.ok).toBe(false)
    expect(result.problems.some((p) => p.includes('captivating'))).toBe(true)
  })

  it('fails on 3 sentences', () => {
    const result = checkDescription('One. Two. Three.')
    expect(result.ok).toBe(false)
    expect(result.problems.some((p) => p.includes('too many sentences'))).toBe(true)
  })

  it('fails on 201 chars', () => {
    const result = checkDescription('a'.repeat(201))
    expect(result.ok).toBe(false)
    expect(result.problems.some((p) => p.includes('too long'))).toBe(true)
  })

  it('fails on empty', () => {
    const result = checkDescription('   ')
    expect(result.ok).toBe(false)
    expect(result.problems).toContain('empty')
  })
})
