import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './21'

const { default: example } = await import('./example.txt')

describe('Day 2020/21', () => {
  describe('Part One', () => {
    test('test input 2020/21a', () => {
      expect(partOne(parse(example))).toBe(5)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2020/21b', () => {
      expect(partTwo(parse(example))).toBe('mxmxvkd,sqjhc,fvjkl')
    })
  })
})