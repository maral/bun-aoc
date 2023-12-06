import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './06'

const example = `Time:      7  15   30
Distance:  9  40  200`

describe('Day 6', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(288)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(71503)
    })
  })
})
