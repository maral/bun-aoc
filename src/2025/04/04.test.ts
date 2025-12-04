import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './04'

const { default: example } = await import('./example.txt')

describe('Day 2025/4', () => {
  describe('Part One', () => {
    test('test input 2025/4a', () => {
      expect(partOne(parse(example))).toBe(13)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2025/4b', () => {
      expect(partTwo(parse(example))).toBe(43)
    })
  })
})