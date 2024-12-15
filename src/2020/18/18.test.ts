import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './18'

const { default: example } = await import('./example.txt')

describe('Day 2020/18', () => {
  describe('Part One', () => {
    test('test input 2020/18a', () => {
      expect(partOne(parse(example))).toBe(26)
    })
  })

  describe('Part Two', () => {
    test('test input 2020/18b', () => {
      expect(partTwo(parse(example))).toBe(46)
    })

    test('test input 2020/18b2', () => {
      expect(partTwo(parse('1 + (2 * 3) + (4 * (5 + 6))'))).toBe(51)
    })

    test('test input 2020/18b3', () => {
      expect(partTwo(parse('5 + (8 * 3 + 9 + 3 * 4 * 3)'))).toBe(1445)
    })

    test('test input 2020/18b4', () => {
      expect(partTwo(parse('5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))'))).toBe(
        669060
      )
    })

    test('test input 2020/18b5', () => {
      expect(
        partTwo(parse('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'))
      ).toBe(23340)
    })

    test('test input 2020/18b6', () => {
      expect(
        partTwo(
          parse(`1 + (2 * 3) + (4 * (5 + 6))
2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)`)
        )
      ).toBe(1542)
    })

    test('test input 2020/18b7', () => {
      expect(partTwo(parse('1 + 2 * 3 + 4 * 5 + 6'))).toBe(231)
    })
  })
})
