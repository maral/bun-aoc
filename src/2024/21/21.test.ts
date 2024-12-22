import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './21'

const { default: example } = await import('./example.txt')

describe('Day 2024/21', () => {
  describe('Part One', () => {
    test('test input 2024/21a', () => {
      expect(partOne(parse(example))).toBe(126384)
    })
  })
})
