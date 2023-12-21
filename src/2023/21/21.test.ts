import { describe, expect, test } from 'bun:test'
import { getDiagonalSum, getOptionsForInfiniteFarm, getStraightSum, parse, partOne, partTwo } from './21'

const { default: example } = await import('./example.txt')

describe('Day 21', () => {
  describe('Utils', () => {
    // test('getDiagonalSum', () => {
    //   expect(getDiagonalSum(1, 1, 1)).toBe(1)
    //   expect(getDiagonalSum(2, 1, 1)).toBe(3)
    //   expect(getDiagonalSum(3, 1, 1)).toBe(6)
    //   expect(getDiagonalSum(4, 1, 1)).toBe(10)
      
    //   expect(getDiagonalSum(2, 2, 3)).toBe(2 + 2*3)
    //   expect(getDiagonalSum(3, 2, 3)).toBe(2 + 3*2 + 2*3)
    // })

    // test('getStraightSum', () => {
    //   expect(getStraightSum(1, 1, 1)).toBe(1)
    //   expect(getStraightSum(2, 1, 1)).toBe(2)
    //   expect(getStraightSum(3, 1, 1)).toBe(3)
    //   expect(getStraightSum(20, 1, 1)).toBe(20)

    //   expect(getStraightSum(20, 1, 10)).toBe(110)
    //   expect(getStraightSum(20, 10, 10)).toBe(200)
    //   expect(getStraightSum(21, 1, 10)).toBe(111)
    // })

    test('getOptionsForInfiniteFarm', () => {
      expect(getOptionsForInfiniteFarm(parse(example), 17)).toBe(332)
      expect(getOptionsForInfiniteFarm(parse(example), 20)).toBe(400)
    })
  })
})