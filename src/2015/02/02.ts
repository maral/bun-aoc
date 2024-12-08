import { parseNumbersGrid } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseNumbersGrid(input, 'x')
}

export function partOne(input: Input) {
  return input.reduce(
    (sum, [a, b, c]) =>
      sum + 2 * (a * b + b * c + a * c) + Math.min(a * b, b * c, a * c),
    0
  )
}

export function partTwo(input: Input) {
  return input.reduce(
    (sum, [a, b, c]) =>
      sum + 2 * (a + b + c) - 2 * Math.max(a, b, c) + a * b * c,
    0
  )
}
