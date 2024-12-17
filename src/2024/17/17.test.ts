import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo, runProgram } from './17'

const { default: example } = await import('./example.txt')

describe('Day 2024/17', () => {
  describe('Part One', () => {
    test('test input 2024/17a1', () => {
      expect(partOne(parse(example))).toBe('4,6,3,5,6,3,5,2,1,0')
    })

    const r = { a: 0n, b: 0n, c: 0n }

    test('test input 2024/17a2', () => {
      expect(
        runProgram({
          registers: { ...r, c: 9n },
          instructions: [2n, 6n]
        }).registers.b
      ).toBe(1n)
    })

    test('test input 2024/17a3', () => {
      expect(
        runProgram({
          registers: { ...r, a: 10n },
          instructions: [5n, 0n, 5n, 1n, 5n, 4n]
        }).output.join(',')
      ).toBe('0,1,2')
    })

    test('test input 2024/17a4', () => {
      const result = runProgram({
        registers: { ...r, a: 2024n },
        instructions: [0n, 1n, 5n, 4n, 3n, 0n]
      })
      expect(result.output.join(',')).toBe('4,2,5,6,7,7,7,7,3,1,0')
      expect(result.registers.a).toBe(0n)
    })

    test('test input 2024/17a5', () => {
      expect(
        runProgram({
          registers: { ...r, b: 29n },
          instructions: [1n, 7n]
        }).registers.b
      ).toBe(26n)
    })

    test('test input 2024/17a6', () => {
      expect(
        runProgram({
          registers: { ...r, b: 2024n, c: 43690n },
          instructions: [4n, 0n]
        }).registers.b
      ).toBe(44354n)
    })
  })
})
