import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './09'

const { default: example } = await import('./example.txt')

describe('Day 2022/9', () => {
  describe('Part One', () => {
    test('test input 2022/9a', () => {
      expect(partOne(parse(example))).toBe(13)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2022/9b', () => {
      expect(partTwo(parse(example))).toBe(1)
    })
  })
})