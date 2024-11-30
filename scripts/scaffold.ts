import chalk from 'npm:chalk'
import dedent from 'npm:dedent'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'

import { fetchInput } from './api.ts'

export async function scaffold(day: number, year: number) {
  const name = `${day}`.padStart(2, '0')

  const directory = new URL(`../src/${year}/${name}/`, import.meta.url)

  if (existsSync(directory)) return

  console.log(`📂 Setting up day ${day} of ${year}`)

  await mkdir(directory, { recursive: true })

  const test = dedent`
  import { describe, expect, test } from 'bun:test'
  import { parse, partOne, partTwo } from './${name}'

  const { default: example } = await import('./example.txt')

  describe(${`'Day ${day}'`}, () => {
    describe('Part One', () => {
      test('test input', () => {
        expect(partOne(parse(example))).toBe(0)
      })
    })
    
    describe('Part Two', () => {
      test('test input', () => {
        expect(partTwo(parse(example))).toBe(0)
      })
    })
  })
  `

  const solution = dedent`
  export function parse(input: string) {
    return input
  }
  
  export function partOne(input: ReturnType<typeof parse>) {}

  export function partTwo(input: ReturnType<typeof parse>) {}
  `

  console.log(`📂 Fetching your input`)

  const input = await fetchInput({ day, year }).catch(() => {
    console.log(
      chalk.red.bold(
        '📂 Fetching your input have failed, empty file will be created.'
      )
    )
  })

  await Deno.writeTextFile(new URL(`${name}.test.ts`, directory.href), test)
  await Deno.writeTextFile(new URL(`${name}.ts`, directory.href), solution)
  await Deno.writeTextFile(new URL(`input.txt`, directory.href), input ?? '')
  await Deno.writeTextFile(new URL(`example.txt`, directory.href), '')

  console.log('📂 You all set up, have fun!')
}
