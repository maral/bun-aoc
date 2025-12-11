import { describe, expect, test } from 'bun:test'
import { parse, partOne, partTwo } from './11'

const { default: example } = await import('./example.txt')

describe('Day 2025/11', () => {
  describe('Part One', () => {
    test('test input 2025/11a', () => {
      expect(partOne(parse(example))).toBe(5)
    })
  })
  
  describe('Part Two', () => {
    test('test input 2025/11b', () => {
      expect(partTwo(parse(`svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`))).toBe(2)
    })
  })
})