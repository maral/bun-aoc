import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './08'

const example = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

describe('Day 8', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(6)
    })
  })

  const example2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example2))).toBe(6)
    })
  })
})
