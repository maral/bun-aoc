import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './01'

const { default: example } = await import('./example.txt')

describe('Day 2025/1', () => {
  describe('Part One', () => {
    test('test input 2025/1a', () => {
      expect(partOne(parse(example))).toBe(3)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2025/1b', () => {
      expect(partTwo(parse(example))).toBe(6)
    })
  })
})