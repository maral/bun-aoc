import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './19'

const { default: example } = await import('./example.txt')

describe('Day 2020/19', () => {
  describe('Part One', () => {
    test('test input 2020/19a', () => {
      expect(partOne(parse(example))).toBe(2)
    })
  })
})
