import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './17'

const { default: example } = await import('./example.txt')

describe('Day 17', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(102)
    })
  })
  
  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(94)
    })
  })
})