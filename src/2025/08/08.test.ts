import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './08'

const { default: example } = await import('./example.txt')

describe('Day 2025/8', () => {
  describe('Part One', () => {
    test('test input 2025/8a', () => {
      expect(partOne(parse(example), 10)).toBe(40)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2025/8b', () => {
      expect(partTwo(parse(example))).toBe(25272)
    })
  })
})