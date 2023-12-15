import { describe, expect, test } from 'bun:test'
import { fnv1a, parse, partOne, partTwo, tilt } from './14'

const example = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`

describe('Day 14', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(136)
    })
  })

  describe('Utils', () => {
    test('fnv1a', () => {
      const parsed = parse(example)
      expect(fnv1a(parsed)).toBe(1569778198)

      const changeSingleChar = [['.', ...parsed[0]!.slice(1)], ...parsed.slice(1)]
      expect(fnv1a(changeSingleChar)).toBe(3970664259)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(64)
    })
  })
})
