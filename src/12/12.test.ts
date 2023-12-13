import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo, sumWithSpaces } from './12'

const example = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`

const example2 = `?###???????? 3,2,1`

describe('Day 12', () => {
  describe('Utils', () => {
    test('sumWithSpaces', () => {
      expect(sumWithSpaces([1])).toBe(1)
      expect(sumWithSpaces([1, 1, 3])).toBe(7)
    })
  })

  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse('.#.?????#.? 1,4'))).toBe(1)
      expect(partOne(parse('.?????????.?????..?? 6,1'))).toBe(31)
      expect(partOne(parse('?##?#??##?.?#. 8,1'))).toBe(1)
      expect(partOne(parse(example2))).toBe(10)
      expect(partOne(parse(example))).toBe(21)
    })
  })

  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(525152)
    })
  })
})
