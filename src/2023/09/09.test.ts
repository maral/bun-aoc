import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './09'

const example = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

describe('Day 9', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(114)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(2)
    })
  })
})
