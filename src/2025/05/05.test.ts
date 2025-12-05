import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './05'

const { default: example } = await import('./example.txt')

describe('Day 2025/5', () => {
  describe('Part One', () => {
    test('test input 2025/5a', () => {
      expect(partOne(parse(example))).toBe(3)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2025/5b', () => {
      expect(partTwo(parse(example))).toBe(14)
    })
  })
})