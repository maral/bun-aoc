import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './09'

const { default: example } = await import('./example.txt')

describe('Day 2024/9', () => {
  describe('Part One', () => {
    test('test input 2024/9a', () => {
      expect(partOne(parse(example))).toBe(1928)
      expect(partOne(parse('131'))).toBe(1)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2024/9b', () => {
      expect(partTwo(parse(example))).toBe(2858)
    })
  })
})