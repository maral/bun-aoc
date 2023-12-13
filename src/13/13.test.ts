import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './13'

const example = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`

const example2 = `#..#..#..##..#.
...#..##.##.#..
###.#.########.
##.#...##..##..
#.####...##...#
.####.#.####.#.
##.##..######..
.####..#....#..
.##.##.##..##.#
..#.##...##...#
#.#.#.##.##.##.
#####.#.#..#.#.
...##...####...
#.#..##.#..#.##
.####.#.####.#.
.####.#.####.#.
#.#..##.#..#.##`

describe('Day 13', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(405)
      expect(partOne(parse(example2))).toBe(1500)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(400)
    })
  })
})
