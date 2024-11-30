import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'

import { parse, partOne, partTwo } from './12.ts'

const decoder = new TextDecoder('utf-8')
const example = decoder.decode(await Deno.readFile('./example.txt'))

describe('Day 12', () => {
  describe('Part One', () => {
    it('test input', () => {
      expect(partOne(parse(example))).toBe(25)
    })
  })

  describe('Part Two', () => {
    it('test input', () => {
      expect(partTwo(parse(example))).toBe(0)
    })
  })
})
