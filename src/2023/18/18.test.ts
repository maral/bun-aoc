import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './18'

const { default: example } = await import('./example.txt')

describe('Day 18', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(62)
    })
  })
  
  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(952408144115)
    })
  })
})