import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './17'

const { default: example } = await import('./example.txt')

describe('Day 2020/17', () => {
  describe('Part One', () => {
    test('test input 2020/17a', () => {
      expect(partOne(parse(example))).toBe(112)
    })
  })

  describe('Part Two', () => {
    test('test input 2020/17b', () => {
      expect(partTwo(parse(example))).toBe(848)
    })
  })
})
