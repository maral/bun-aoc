import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './09'

const { default: example } = await import('./example.txt')
const { default: example2 } = await import('./example2.txt')
const { default: example3 } = await import('./example3.txt')
const { default: example4 } = await import('./example4.txt')

describe('Day 2025/9', () => {
  describe('Part One', () => {
    test('test input 2025/9a', () => {
      expect(partOne(parse(example))).toBe(50)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2025/9bI', () => {
      expect(partTwo(parse(example))).toBe(24)
    })
    
    test('test input 2025/9bII', () => {
      expect(partTwo(parse(example2))).toBe(40)
    })

    test('test input 2025/9bIII', () => {
      expect(partTwo(parse(example3))).toBe(30)
    })

    test('test input 2025/9bIV', () => {
      expect(partTwo(parse(example4))).toBe(66)
    })
  })
})

const ex = `...............
...##########.........
...#........#..
...#...######.......
...#...#....
...#...####....
...#......#....
...#......#....
...#......#....
...########...........
...............
...............
...............
...............`