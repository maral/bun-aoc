import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './02'

const { default: example } = await import('./example.txt')

describe('Day 2016/2', () => {
  describe('Part One', () => {
    test('test input 2016/2a', () => {
      expect(partOne(parse(example))).toBe('1985')
    })
  })

  describe('Part Two', () => {
    test('test input 2016/2b', () => {
      expect(partTwo(parse(example))).toBe('5DB3')
    })
  })
})
