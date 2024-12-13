import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './13'

const { default: example } = await import('./example.txt')

describe('Day 2024/13', () => {
  describe('Part One', () => {
    test('test input 2024/13a', () => {
      expect(partOne(parse(example))).toBe(480)
    })
  })
})