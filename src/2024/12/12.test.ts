import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './12'

const { default: example } = await import('./example.txt')

describe('Day 2024/12', () => {
  describe('Part One', () => {
    test('test input 2024/12a', () => {
      expect(partOne(parse(example))).toBe(1930)
    })
  })

  describe('Part Two', () => {
    test('test input 2024/12ba', () => {
      expect(
        partTwo(
          parse(`AAAA
BBCD
BBCC
EEEC`)
        )
      ).toBe(80)
    })


    test('test input 2024/12bb', () => {
      expect(
        partTwo(
          parse(`EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`)
        )
      ).toBe(236)
    })
  })
})
