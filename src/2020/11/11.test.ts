import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './11'

const { default: example } = await import('./example.txt')

describe('Day 11', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(37)
    })
  })
  
  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(26)
    })
  })
})