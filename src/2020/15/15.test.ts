import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './15'

const { default: example } = await import('./example.txt')

describe('Day 2020/15', () => {
  describe('Part One', () => {
    test('test input 2020/15a', () => {
      expect(partOne(parse(example))).toBe(0)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2020/15b', () => {
      expect(partTwo(parse(example))).toBe(0)
    })
  })
})