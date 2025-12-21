import { describe, expect, test } from 'bun:test'
import { getNextReading } from './10'

describe('Day 2015/10', () => {
  describe('Part One', () => {
    test('test input 2015/10a', () => {
      expect(getNextReading('1')).toBe('11')
      expect(getNextReading('11')).toBe('21')
      expect(getNextReading('21')).toBe('1211')
      expect(getNextReading('1211')).toBe('111221')
      expect(getNextReading('111221')).toBe('312211')
    })
  })
})
