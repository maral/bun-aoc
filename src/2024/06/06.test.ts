import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './06'

const { default: example } = await import('./example.txt')

describe('Day 6', () => {
  describe('Part One', () => {
    test('test input 2024/6a', () => {
      expect(partOne(parse(example))).toBe(41)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2024/6b', () => {
      expect(partTwo(parse(example))).toBe(6)
    })
  })
})