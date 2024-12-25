import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './24'

const { default: example } = await import('./example.txt')

describe('Day 2020/24', () => {
  describe('Part One', () => {
    test('test input 2020/24a', () => {
      expect(partOne(parse(example))).toBe(10)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2020/24b1', () => {
      expect(partTwo(parse(example), 0)).toBe(10)
    })

    test('test input 2020/24b2', () => {
      expect(partTwo(parse(example), 1)).toBe(15)
    })

    test('test input 2020/24b3', () => {
      expect(partTwo(parse(example), 3)).toBe(25)
    })

    test('test input 2020/24b4', () => {
      expect(partTwo(parse(example))).toBe(2208)
    })
  })
})