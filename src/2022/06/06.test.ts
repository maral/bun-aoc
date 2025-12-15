import { describe, expect, test } from 'bun:test'
import { parse, partOne } from './06'

describe('Day 2022/6', () => {
  describe('Part One', () => {
    test('test input 2022/6a', () => {
      expect(partOne(parse('mjqjpqmgbljsphdztnvjfqwrcgsmlb'))).toBe(7)
    })
  })
})
