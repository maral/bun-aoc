import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo, partTwoEasier } from './10'

const example = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`

describe('Day 10', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(8)
    })
  })

  const example2 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`
  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example2))).toBe(4)
    })

    test('test easier version', () => {
      expect(partTwoEasier(parse(example2))).toBe(4)
    })
  })
})
