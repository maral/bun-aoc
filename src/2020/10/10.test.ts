import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './10'

const { default: example } = await import('./example.txt')

const example2 = `16
10
15
5
1
11
7
19
6
12
4`

describe('Day 10', () => {
  describe('Part Two', () => {
    test('test simpler input', () => {
      expect(partTwo(parse(example2))).toBe(8)
    })

    test('test input', () => {
      expect(partTwo(parse(example))).toBe(19208)
    })
  })
})
