import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './12'

const { default: example } = await import('./example.txt')

describe('Day 2022/12', () => {
  describe('Part One', () => {
    test('test input 2022/12a', () => {
      expect(partOne(parse(example))).toBe(31)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2022/12b', () => {
      expect(partTwo(parse(example))).toBe(29)
    })
  })
})