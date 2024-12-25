import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './23'

const { default: example } = await import('./example.txt')

describe('Day 2020/23', () => {
  describe('Part One', () => {
    test('test input 2020/23a', () => {
      expect(partOne(parse(example))).toBe('67384529')
    })
  })
  
  describe('Part Two', () => {
    test('test input 2020/23b', () => {
      expect(partTwo(parse(example))).toBe(0)
    })
  })
})