import { describe, expect, test } from 'bun:test'
import { collidesInPlane, deserializeBrick, parse, partOne, partTwo } from './22'

const { default: example } = await import('./example.txt')

function doBrickCollide(brick: string, other: string) {
  return collidesInPlane(deserializeBrick(brick), deserializeBrick(other))
}

describe('Day 22', () => {
  describe('Part One', () => {
    test('test input', () => {
      expect(partOne(parse(example))).toBe(5)
    })
  })
  
  describe('Part Two', () => {
    test('test input', () => {
      expect(partTwo(parse(example))).toBe(7)
    })
  })

  describe('Utils', () => {
    test('collidesInPlane', () => {
      expect(doBrickCollide("1,0,1~1,2,1", "0,0,1~2,0,1")).toBe(true)
      expect(doBrickCollide("0,0,1~2,0,1", "1,0,1~1,2,1")).toBe(true)
    })
  })
})