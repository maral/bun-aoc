import range from 'lodash.range'
import { Coord } from '../../utils'
import lcm from 'compute-lcm'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n\n').map(group => {
    const [a, b, prize] = group.split('\n')
    const aMatch = /Button A: X\+(\d+), Y\+(\d+)/.exec(a)
    const bMatch = /Button B: X\+(\d+), Y\+(\d+)/.exec(b)
    const prizeMatch = /Prize: X=(\d+), Y=(\d+)/.exec(prize)
    return {
      a: [parseInt(aMatch![1]), parseInt(aMatch![2])] as Coord,
      b: [parseInt(bMatch![1]), parseInt(bMatch![2])] as Coord,
      prize: [parseInt(prizeMatch![1]), parseInt(prizeMatch![2])] as Coord
    }
  })
}

export function partOne(input: Input) {
  let sum = 0
  for (const { a, b, prize } of input) {
    if ((prize[0] / b[0]) % 1 === 0 && prize[0] / b[0] === prize[1] / b[1]) {
      sum += prize[0] / b[0]
      continue
    }
    for (const ca of range(101)) {
      let shouldBreak = false
      for (const cb of range(101)) {
        if (
          prize[0] === a[0] * ca + b[0] * cb &&
          prize[1] === a[1] * ca + b[1] * cb
        ) {
          sum += ca * 3 + cb
          shouldBreak = true
          break
        }
      }
      if (shouldBreak) {
        break
      }
    }
  }
  return sum
}

const inc = 10000000000000
export function partTwo(input: Input) {
  let sum = 0
  for (const {
    a: [a, c],
    b: [b, d],
    prize
  } of input) {
    const [e, f] = [prize[0] + inc, prize[1] + inc]
    // solve equations
    // a       b       e
    // 94 * x + 22 * y = 8400
    // c       d       f
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

    const det = a * d - c * b
    const x = (e * d - b * f) / det
    const y = (a * f - c * e) / det

    if (x % 1 === 0 && y % 1 === 0 && x >= 0 && y >= 0) {
      sum += x * 3 + y
    }
  }
  return sum
}
