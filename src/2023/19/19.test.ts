import { describe, expect, test } from 'bun:test'
import { parse, getTokens, partOne, partTwo } from './19'

const { default: example } = await import('./example.txt')

describe('Day 19', () => {
  describe('Utils', () => {
    test('parseExpression', () => {
      expect(getTokens('a<2006')).toEqual([
        { type: 'identifier', value: 'a', from: 0, to: 1 },
        { type: 'lessThan', value: '<', from: 1, to: 2 },
        { type: 'number', value: '2006', from: 2, to: 6 }
      ])
    })
  })

  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(19114)
    })
  })
  
  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(167409079868000)
    })
  })
})