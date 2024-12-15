import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './15'

const { default: example } = await import('./example.txt')

describe('Day 2024/15', () => {
  describe('Part One', () => {
    test('test input 2024/15a', () => {
      expect(partOne(parse(example))).toBe(2028)
    })
  })

  describe('Part Two', () => {
    test('test input 2024/15b1', () => {
      expect(
        partTwo(
          parse(`#######
#@O.O.#
#######

>>>>>>`)
        )
      ).toBe(218)
    })

    test('test input 2024/15b2', () => {
      expect(
        partTwo(
          parse(`#######
#.....#
#.O...#
#.OO@.#
#.....#
#.....#
#######

<^<^<vv>>>>>`)
        )
      ).toBe(1412)
    })

    test('test input 2024/15b3', () => {
      expect(
        partTwo(
          parse(`#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`)
        )
      ).toBe(618)
    })
  })
})
