import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './08'

const { default: example } = await import('./example.txt')

describe('Day 8', () => {
  describe('Part One', () => {
    test('test input 2024/8a', () => {
      expect(partOne(parse(example))).toBe(14)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2024/8b', () => {
      expect(partTwo(parse(example))).toBe(34)
    })
  })
})