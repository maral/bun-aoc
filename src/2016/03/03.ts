import range from 'lodash.range'
import { ints } from '../../utils'

type Input = ReturnType<typeof parse>
type Triplet = [number, number, number]

export function parse(input: string) {
  return input.split('\n').map(line => ints(line)) as Triplet[]
}

export function partOne(input: Input) {
  return input.filter(isTriangle).length
}

export function partTwo(input: Input) {
  const triplets: Triplet[] = []
  for (let i = 0; i < input.length; i += 3) {
    for (const j of range(3)) {
      triplets.push([input[i][j], input[i + 1][j], input[i + 2][j]])
    }
  }
  return triplets.filter(isTriangle).length
}

function isTriangle([a, b, c]: Triplet) {
  return a + b > c && b + c > a && a + c > b
}
