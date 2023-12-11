import { describe, expect, test } from 'bun:test'
import { getSums, parse, partOne, partTwo } from './11'

const example = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`

describe('Day 11', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(374)
    })
  })

  describe('Part Two', () => {
    test('test input 10x', () => {
      expect(getSums(parse(example), 10)).toBe(1030)
    })

    test('test input 100x', () => {
      expect(getSums(parse(example), 100)).toBe(8410)
    })
  })
})
