import range from 'lodash.range'
import {
  Coord,
  get2DKey,
  get4Directions,
  parseNumbersGrid,
  step
} from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseNumbersGrid(input, '')
}

export function partOne(input: Input) {
  let sum = 0
  for (const [y, line] of input.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === 0) {
        sum += getTrailheadScore(input, x, y)
      }
    }
  }
  return sum
}

export function partTwo(input: Input) {
  let sum = 0
  for (const [y, line] of input.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === 0) {
        sum += getTrailheadScore(input, x, y, true)
      }
    }
  }
  return sum
}

function getTrailheadScore(
  input: Input,
  x: number,
  y: number,
  uniquePath = false
) {
  let currPositions: Coord[] = [[x, y]]
  let nextPositions: Coord[] = []
  const visited = new Set<number>()
  for (const i of range(1, 10)) {
    for (const position of currPositions) {
      for (const d of get4Directions()) {
        const pos: Coord = step(position, d)
        if (!uniquePath && visited.has(get2DKey(pos))) {
          continue
        }
        if (input[pos[1]]?.[pos[0]] === i) {
          nextPositions.push(pos)
          if (!uniquePath) {
            visited.add(get2DKey(pos))
          }
        }
      }
    }
    currPositions = nextPositions
    nextPositions = []
  }
  return currPositions.length
}
