import { parseNumbersGrid } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input
    .split('\n')
    .map(line =>
      line
        .split(',')
        .map(
          range => range.split('-').map(n => parseInt(n)) as [number, number]
        )
    )
}

export function partOne(input: Input) {
  return input.filter(
    ([range1, range2]) =>
      (between(range1[0], range2) && between(range1[1], range2)) ||
      (between(range2[0], range1) && between(range2[1], range1))
  ).length
}

export function partTwo(input: Input) {
  return input.filter(
    ([range1, range2]) =>
      between(range1[0], range2) ||
      between(range1[1], range2) ||
      between(range2[0], range1) ||
      between(range2[1], range1)
  ).length
}

function between(n: number, range: [number, number]) {
  return range[0] <= n && n <= range[1]
}
