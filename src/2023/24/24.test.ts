import { describe, expect, test } from 'bun:test'
import {
  countFutureCollisions,
  findStoneStart,
  get2DCollisionPoint,
  parse,
  parseHail,
  partOne,
  partTwo
} from './24'

const { default: example } = await import('./example.txt')

describe('Day 24', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(countFutureCollisions(parse(example), 7, 27)).toBe(2)
    })
  })

  describe('Utils', () => {
    test('', () => {
      expect(
        get2DCollisionPoint(
          parseHail('19, 13, 30 @ -2, 1, -2'),
          parseHail('18, 19, 22 @ -1, -1, -2'),
          { x: -3, y: 1, z: 2 }
        )
      ).toStrictEqual({ x: 24, y: 13, z: 0 })

      expect(
        get2DCollisionPoint(
          parseHail('19, 13, 30 @ -2, 1, -2'),
          parseHail('20, 25, 34 @ -2, -2, -4'),
          { x: -3, y: 1, z: 2 }
        )
      ).toStrictEqual({ x: 24, y: 13, z: 0 })
    })
  })
})
