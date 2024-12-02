import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './13'

const { default: example } = await import('./example.txt')

describe('Day 13', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(295)
    })
  })

  describe('Part Two', () => {
    const easyTest = `
17,x,13,19`
    test('test input two', () => {
      expect(partTwo(parse(easyTest))).toBe(3417)
    })

    test('test input 2b', () => {
      expect(
        partTwo(
          parse(`
67,7,59,61`)
        )
      ).toBe(754018)
    })
  })
})
