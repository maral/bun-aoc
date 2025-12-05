import { parseNumbersGrid } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseNumbersGrid(input, '')
}

export function partOne(input: Input) {
  let sum = 0
  for (const line of input) {
    sum += findJoltage(line, 2)
  }
  return sum
}

function findJoltage(line: number[], pow: number, joltage = 0) {
  if (pow === 0) {
    return joltage
  }
  const first = Math.max(...line.slice(0, line.length - pow + 1))
  const index = line.indexOf(first)
  return findJoltage(line.slice(index + 1), pow - 1, joltage * 10 + first)
}

export function partTwo(input: Input) {
  let sum = 0
  for (const line of input) {
    sum += findJoltage(line, 12)
  }
  return sum
}
