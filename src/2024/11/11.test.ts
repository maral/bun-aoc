import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './11'

describe('Day 2024/11', () => {
  describe('Part One', () => {
    test('test input 2024/11a', () => {
      expect(partOne(parse('125 17'))).toBe(55312)
    })
  })

  describe('Part Two', () => {
    test('test input 2024/11b', () => {
      expect(partTwo([0], 3)).toBe(2)
      expect(partTwo([0, 0], 3)).toBe(4)
    })
  })
})
