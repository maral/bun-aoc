import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './08'

const { default: example } = await import('./example.txt')

describe('Day 2022/8', () => {
  describe('Part One', () => {
    test('test input 2022/8a', () => {
      expect(partOne(parse(example))).toBe(21)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2022/8b', () => {
      expect(partTwo(parse(example))).toBe(8)
    })
  })
})