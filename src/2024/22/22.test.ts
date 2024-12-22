import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './22'

const { default: example } = await import('./example.txt')

describe('Day 2024/22', () => {
  describe('Part One', () => {
    test('test input 2024/22a', () => {
      expect(partOne(parse(example))).toBe(37327623)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2024/22b', () => {
      expect(partTwo(parse(`1
2
3
2024`))).toBe(23)
    })
  })
})