import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './08'

const { default: example } = await import('./example.txt')

describe('Day 2015/8', () => {
  describe('Part One', () => {
    test('test input 2015/8a', () => {
      expect(partOne(parse(example))).toBe(12)
    })
  })
})
