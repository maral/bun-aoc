import { describe, expect, test } from 'bun:test'
import { findFastestPath, parse, partOne, partTwo } from './18'

const { default: example } = await import('./example.txt')

describe('Day 2024/18', () => {
  describe('Part One', () => {
    test('test input 2024/18a', () => {
      expect(findFastestPath(parse(example), 7, 7, 12)).toBe(22)
    })
  })

  describe('Part Two', () => {
    test('test input 2024/18b', () => {
      expect(partTwo(parse(example), 12)).toBe('6,1')
    })
  })
})
