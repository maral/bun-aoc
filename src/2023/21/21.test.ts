import { describe, expect, test } from 'bun:test'
import {
  getDiagonalSum,
  getOptionsForInfiniteFarm,
  getStraightSum,
  parse,
  partOne,
  partTwo
} from './21'

const { default: example } = await import('./example.txt')

describe('Day 21', () => {
  describe('Utils', () => {
    test('getDiagonalSum', () => {
      expect(getDiagonalSum(1, 1, 1, 'odd')).toBe(1)
      expect(getDiagonalSum(2, 1, 1, 'odd')).toBe(3)
      expect(getDiagonalSum(3, 1, 1, 'odd')).toBe(6)
      expect(getDiagonalSum(4, 1, 1, 'odd')).toBe(10)

      expect(getDiagonalSum(2, 2, 3, 'odd')).toBe(2 + 2 * 3)
      expect(getDiagonalSum(3, 2, 3, 'odd')).toBe(2 + 3 * 2 + 2 * 3)
    })

    test('getStraightSum', () => {
      expect(getStraightSum(1, 1, 1, 'odd')).toBe(1)
      expect(getStraightSum(2, 1, 1, 'odd')).toBe(2)
      expect(getStraightSum(3, 1, 1, 'odd')).toBe(3)
      expect(getStraightSum(20, 1, 1, 'odd')).toBe(20)

      expect(getStraightSum(20, 1, 10, 'odd')).toBe(110)
      expect(getStraightSum(20, 10, 10, 'odd')).toBe(200)
      expect(getStraightSum(21, 1, 10, 'odd')).toBe(111)
    })

    test('getOptionsForInfiniteFarm', () => {
      expect(getOptionsForInfiniteFarm(parse(example), 17)).toBe(324)
      expect(getOptionsForInfiniteFarm(parse(example), 20)).toBe(441)
    })

    test('getOptionsForInfiniteFarm - mini example', () => {
      const miniExample = `...
.S.
...`
      expect(getOptionsForInfiniteFarm(parse(miniExample), 5)).toBe(36)
      expect(getOptionsForInfiniteFarm(parse(miniExample), 7)).toBe(64)
    })

    test('getOptionsForInfiniteFarm - some obstacles', () => {
      const example2 = `.....
.#.#.
.....
.#.#.
.....`
      expect(getOptionsForInfiniteFarm(parse(example2), 17)).toBe(260)
    })
  })
})
