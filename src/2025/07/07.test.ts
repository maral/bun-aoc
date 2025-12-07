import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './07'

const { default: example } = await import('./example.txt')

describe('Day 2025/7', () => {
  describe('Part One', () => {
    test('test input 2025/7a', () => {
      expect(partOne(parse(example))).toBe(21)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2025/7b', () => {
      expect(partTwo(parse(example))).toBe(40)
    })
  })
})