import { describe, expect, test } from 'bun:test'
import { parse, partOne, pushesUntil } from './20'

const { default: example } = await import('./example.txt')

describe('Day 20', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(32000000)
    })
  })
  
  describe('Part Two', () => {
    test('test input', () => {
      const example2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`
      expect(pushesUntil(parse(example2), 'a', 'low')).toBe(1)
      expect(pushesUntil(parse(example2), 'b', 'low')).toBe(1)
      expect(pushesUntil(parse(example2), 'b', 'high')).toBe(2)
      expect(pushesUntil(parse(example2), 'con', 'low')).toBe(2)
      expect(pushesUntil(parse(example2), 'con', 'high')).toBe(1)
      expect(pushesUntil(parse(example2), 'output', 'low')).toBe(1)
      expect(pushesUntil(parse(example2), 'output', 'high')).toBe(1)
    })
  })
})