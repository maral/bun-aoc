import { argv } from 'bun'
import chalk from 'chalk'
import { formatPerformance, withPerformance, isBetween } from './utils.ts'
import { scaffold } from './scaffold.ts'
import { existsSync } from 'node:fs'
import range from 'lodash.range'

const year = parseInt(argv[3] ?? process.env.YEAR ?? new Date().getFullYear())
if (argv[2] === 'all') {
  let totalPerformance = 0
  for (const day of range(1, 26)) {
    const name = `${day}`.padStart(2, '0')
    const directory = new URL(`../src/${year}/${name}/`, import.meta.url)

    if (!existsSync(directory)) {
      continue
    }

    console.log('📅', 'Day', chalk.bold(name))
    totalPerformance += await processDayInYear(day, year)
    console.log()
  }
  console.log(
    '⏳',
    'Total time:',
    chalk.bold(formatPerformance(totalPerformance))
  )
  process.exit(0)
} else {
  const day = parseInt(argv[2] ?? '')
  if (!isBetween(day, [1, 25])) {
    console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`)
    console.log(`🎅 To get started, try: ${chalk.cyan('bun solve 1')}`)
    process.exit(0)
  }

  await scaffold(day, year)
  processDayInYear(day, year)
}

async function processDayInYear(day: number, year: number): Promise<number> {
  const name = `${day}`.padStart(2, '0')

  const { default: input } = await import(`@/${year}/${name}/input.txt`)
  const { partOne, partTwo, parse } = await import(
    `@/${year}/${name}/${name}.ts`
  )
  const sanitizedInput = input?.trim('\n') ?? ''

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

  return onePerformance + twoPerformance
}
