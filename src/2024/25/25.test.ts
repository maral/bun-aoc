import { describe, expect, test } from 'bun:test'
import { parse, partOne } from './25'

const { default: example } = await import('./example.txt')

describe('Day 2024/25', () => {
  describe('Part One', () => {
    test('test input 2024/25a', () => {
      expect(partOne(parse(example))).toBe(3)
    })
  })
})