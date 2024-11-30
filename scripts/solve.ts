import chalk from 'npm:chalk'
import { formatPerformance, withPerformance, isBetween } from './utils.ts'
import { scaffold } from './scaffold.ts'
import process from 'node:process'

const day = parseInt(process.argv[2] ?? '')
const year = parseInt(
  process.argv[3] ?? process.env.YEAR ?? new Date().getFullYear()
)

if (!isBetween(day, [1, 25])) {
  console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`)
  console.log(`🎅 To get started, try: ${chalk.cyan('bun solve 1')}`)
  process.exit(0)
}

await scaffold(day, year)

const name = `${day}`.padStart(2, '0')

const input = await Deno.readTextFile(`./src/${year}/${name}/input.txt`)
const { partOne, partTwo, parse } = await import(
  `../src/${year}/${name}/${name}.ts`
)
const sanitizedInput = input?.endsWith('\n') ? input.slice(0, -1) : input

const [one, onePerformance] = withPerformance(
  () => partOne?.(parse(sanitizedInput))
)
const [two, twoPerformance] = withPerformance(
  () => partTwo?.(parse(sanitizedInput))
)

console.log(
  '🌲',
  'Part One:',
  chalk.green(one ?? '—'),
  one ? `(${formatPerformance(onePerformance)})` : ''
)
console.log(
  '🎄',
  'Part Two:',
  chalk.green(two ?? '—'),
  two ? `(${formatPerformance(twoPerformance)})` : ''
)
