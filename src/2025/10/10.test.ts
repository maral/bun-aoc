import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './10'

const { default: example } = await import('./example.txt')

describe('Day 2025/10', () => {
  describe('Part One', () => {
    test('test input 2025/10a', () => {
      expect(partOne(parse(example))).toBe(0)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2025/10b', () => {
      expect(partTwo(parse(example))).toBe(0)
    })
  })
})