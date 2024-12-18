import { describe, expect, test } from 'bun:test'
import { parse, partTwo } from './01'

const { default: example } = await import('./example.txt')

describe('Day 2016/1', () => {
  describe('Part Two', () => {
    test('test input 2016/1b', () => {
      expect(partTwo(parse(example))).toBe(4)
    })
  })
})
