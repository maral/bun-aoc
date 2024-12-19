import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './19'

const { default: example } = await import('./example.txt')

describe('Day 2024/19', () => {
  describe('Part One', () => {
    test('test input 2024/19a', () => {
      expect(partOne(parse(example))).toBe(6)
    })
  })

  describe('Part Two', () => {
    test('test input 2024/19b1', () => {
      expect(partTwo(parse(example))).toBe(16)
    })

    const ex2 = `r, wr, b, g, bwu, rb, gb, br

rrbgbr`
    test('test input 2024/19b2', () => {
      expect(partTwo(parse(ex2))).toBe(6)
    })
  })
})
