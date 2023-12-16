import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './07'

const example = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

describe('Day 7', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(6440)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(5905)
    })

    test('other input', () => {
      const input = `23JJ3 118
J88J9 816
KAJQ6 454
J8876 171`
      expect(partTwo(parse(input))).toBe(118 * 4 + 816 * 3 + 171 * 2 + 454 * 1)
    })

    test('other random input', () => {
      const input = `JJJ8J 1
KA7AA 2
22J2J 4
7T5KJ 8`
      expect(partTwo(parse(input))).toBe(4 * 4 + 1 * 3 + 2 * 2 + 8 * 1)
    })

    test('full J', () => {
      const input = `JJJJJ 1
KA7AA 2
22J2J 4
7T5KJ 8`
      expect(partTwo(parse(input))).toBe(4 * 4 + 1 * 3 + 2 * 2 + 8 * 1)
    })

    test('weird Js', () => {
      const input = `9A998 1
9A9A9 2
TJ95J 4`
      expect(partTwo(parse(input))).toBe(2 * 3 + 4 * 2 + 1 * 1)
    })
  })
})
