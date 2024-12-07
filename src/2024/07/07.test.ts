import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './07'

const { default: example } = await import('./example.txt')

describe('Day 7', () => {
  describe('Part One', () => {
    test('test input 2024/7a', () => {
      expect(partOne(parse(example))).toBe(3749)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2024/7b', () => {
      expect(partTwo(parse(example))).toBe(11387)
    })
  })
})