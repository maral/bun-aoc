import { Coord, parseRegexNumberLine } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n\n').map(group => {
    const [a, b, prize] = group.split('\n')
    return {
      a: parseRegexNumberLine(/Button A: X\+(\d+), Y\+(\d+)/, a) as Coord,
      b: parseRegexNumberLine(/Button B: X\+(\d+), Y\+(\d+)/, b) as Coord,
      prize: parseRegexNumberLine(/Prize: X=(\d+), Y=(\d+)/, prize) as Coord
    }
  })
}

export function partOne(input: Input) {
  return getTokens(input, 0)
}

export function partTwo(input: Input) {
  return getTokens(input, 10000000000000)
}

function getTokens(input: Input, prizeIncrement: number) {
  let sum = 0
  for (const {
    a: [a, c],
    b: [b, d],
    prize
  } of input) {
    const [e, f] = [prize[0] + prizeIncrement, prize[1] + prizeIncrement]
    // solve equations
    // a        b        e
    // 94 * x + 22 * y = 8400
    // c        d        f
    // 34 * x + 67 * y = 5400

    // ax + by = e
    // cx + dy = f
    // x = (e - b * y) / a
    // y = (f - c * x) / d
    // x = (e - b * (f - c * x) / d) / a
    // a * x = e - b * (f - c * x) / d
    // a * x = e - b * f / d + b * c * x / d
    // a * x - (b * c / d) * x = e - b * f / d
    // x * (a - b * c / d) = e - b * f / d
    // x = (e - b * f / d) / (a - b * c / d)
    // x = (e * d - b * f) / (a * d - b * c)
    //
    // y = (f - c * (e * d - b * f) / (a * d - b * c)) / d
    // y = f / d - (c / d) * (e * d - b * f) / (a * d - b * c)
    // y = f / d - (c * e - c / d * b * f) / (a * d - b * c)
    // y = (f / d * (a * d - b * c)  - (c * e - c / d * b * f)) / (a * d - b * c)
    // y = (a * f - b * c * f / d  - c * e + b * c * f / d) / (a * d - b * c)
    // y = (a * f - c * e) / (a * d - b * c)
    const det = a * d - c * b
    const x = (e * d - b * f) / det
    const y = (a * f - c * e) / det

    if (x % 1 === 0 && y % 1 === 0 && x >= 0 && y >= 0) {
      sum += x * 3 + y
    }
  }
  return sum
}
