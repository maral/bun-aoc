import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'

import { parse, partOne } from './05.ts'

const decoder = new TextDecoder('utf-8')
const example = decoder.decode(await Deno.readFile('./example.txt'))
describe('Day 5', () => {
  describe('Part One', () => {
    it('test input', () => {
      expect(partOne(parse(example))).toBe(820)
    })
  })
})
