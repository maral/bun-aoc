import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './02'

const { default: example } = await import('./example.txt')

describe('Day 2', () => {
  describe('Part Two', () => {
    test('test input 2024/2', () => {
      expect(partTwo(parse(example))).toBe(4)
    })
  })
})