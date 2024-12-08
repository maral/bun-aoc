import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './14'

const { default: example } = await import('./example.txt')

describe('Day 2020/14', () => {
  describe('Part One', () => {
    test('test input 2020/14a', () => {
      expect(partOne(parse(example))).toBe(165n)
    })
  })

  describe('Part Two', () => {
    test('test input 2020/14b', () => {
      expect(
        partTwo(
          parse(`mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`)
        )
      ).toBe(208n)
    })
  })
})
