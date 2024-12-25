import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './22'

const { default: example } = await import('./example.txt')

describe('Day 2020/22', () => {
  describe('Part One', () => {
    test('test input 2020/22a', () => {
      expect(partOne(parse(example))).toBe(306)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2020/22b', () => {
      expect(partTwo(parse(example))).toBe(291)
    })
  })
})