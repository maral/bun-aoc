import range from 'lodash.range'
import { parseCharGrid, parseNumbersGrid } from '../../utils'

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

const directions = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1]
]

function getTrailheadScore(
  input: Input,
  x: number,
  y: number,
  uniquePath = false
) {
  let currPositions: [number, number][] = [[x, y]]
  let nextPositions: [number, number][] = []
  const visited = new Set<number>()
  for (const i of range(1, 10)) {
    for (const position of currPositions) {
      for (const d of directions) {
        const pos: [number, number] = [position[0] + d[0], position[1] + d[1]]
        if (!uniquePath && visited.has(getKey(pos))) {
          continue
        }
        if (input[pos[1]]?.[pos[0]] === i) {
          nextPositions.push(pos)
          visited.add(getKey(pos))
        }
      }
    }
    currPositions = nextPositions
    nextPositions = []
  }
  return currPositions.length
}

function getKey([x, y]: [number, number]) {
  return x * 100000 + y
}
