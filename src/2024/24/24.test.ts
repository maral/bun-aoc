import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './24'

const { default: example } = await import('./example.txt')

describe('Day 2024/24', () => {
  describe('Part One', () => {
    test('test input 2024/24a1', () => {
      expect(
        partOne(
          parse(`x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`)
        )
      ).toBe(4n)
    })

    test('test input 2024/24a2', () => {
      expect(partOne(parse(example))).toBe(2024n)
    })
  })
})
