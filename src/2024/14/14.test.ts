import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './14'

const { default: example } = await import('./example.txt')

describe('Day 2024/14', () => {
  describe('Part One', () => {
    test('test input 2024/14a', () => {
      expect(partOne(parse(example), 11, 7)).toBe(12)
    })
  })
})
