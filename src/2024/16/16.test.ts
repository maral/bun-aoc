import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './16'

const { default: example } = await import('./example.txt')

describe('Day 2024/16', () => {
  describe('Part One', () => {
    test('test input 2024/16a1', () => {
      expect(partOne(parse(example))).toBe(7036)
    })

    const ex = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`
    test('test input 2024/16a2', () => {
      expect(partOne(parse(ex))).toBe(11048)
    })

    const ex2 = `#################
#..............E#
#.#####.#########
#...............#
#######.#######.#
#...............#
#...............#
#S..............#
#################`
    test('test input 2024/16a3', () => {
      expect(partOne(parse(ex2))).toBe(2020)
    })
  })

  describe('Part Two', () => {
    test('test input 2024/16b', () => {
      expect(partTwo(parse(example))).toBe(45)
    })
  })
})
