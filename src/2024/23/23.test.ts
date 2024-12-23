import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './23'

const { default: example } = await import('./example.txt')

describe('Day 2024/23', () => {
  describe('Part One', () => {
    test('test input 2024/23a', () => {
      expect(partOne(parse(example))).toBe(7)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2024/23b', () => {
      expect(partTwo(parse(example))).toBe('co,de,ka,ta')
    })
  })
})