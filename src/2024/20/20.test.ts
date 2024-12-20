import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './20'

const { default: example } = await import('./example.txt')

describe('Day 2024/20', () => {
  describe('Part One', () => {
    test('test input 2024/20a', () => {
      expect(partOne(parse(example), 64)).toBe(1)
    })
  })
})