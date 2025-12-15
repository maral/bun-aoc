import range from 'lodash.range'
import {
  Coord,
  Direction,
  directionsByName,
  get2DKey,
  isDirectionVertical,
  parseNumbersGrid,
  step
} from '../../utils'

type Input = ReturnType<typeof parse>

const dirMap: Record<string, Direction> = {
  R: 0,
  D: 1,
  L: 2,
  U: 3
}

export function parse(input: string) {
  return input.split('\n').map(line => {
    const [direction, length] = line.split(' ')
    return { direction: dirMap[direction], length: Number(length) }
  })
}

export function partOne(input: Input) {
  return followTheHead(input, 2)
}

function followTheHead(input: Input, knotCount: number) {
  const visited = new Set<number>()
  visited.add(get2DKey([0, 0]))
  const knots: Coord[] = range(knotCount).map(() => [0, 0])
  for (const { direction, length } of input) {
    for (const _ of range(length)) {
      knots[0] = step(knots[0], direction)
      for (const k of range(knotCount - 1)) {
        const headPosition = knots[k]
        const tailPosition = knots[k + 1]
        const verticalShift = Math.abs(headPosition[1] - tailPosition[1]) > 1
        const horizontalShift = Math.abs(headPosition[0] - tailPosition[0]) > 1
        if (verticalShift) {
          knots[k + 1] = step(
            tailPosition,
            headPosition[1] > tailPosition[1]
              ? directionsByName.down
              : directionsByName.up
          )
          if (!horizontalShift) {
            knots[k + 1][0] = headPosition[0]
          }
        }
        if (horizontalShift) {
          knots[k + 1] = step(
            knots[k + 1],
            headPosition[0] > tailPosition[0]
              ? directionsByName.right
              : directionsByName.left
          )
          if (!verticalShift) {
            knots[k + 1][1] = headPosition[1]
          }
        }
      }
      visited.add(get2DKey(knots[knotCount - 1]))
    }
  }
  return visited.size
}

export function partTwo(input: Input) {
  return followTheHead(input, 10)
}

function printMap(knots: Coord[]) {
  const xRange = [
    Math.min(...knots.map(k => k[0])),
    Math.max(...knots.map(k => k[0]))
  ]
  const yRange = [
    Math.min(...knots.map(k => k[1])),
    Math.max(...knots.map(k => k[1]))
  ]

  for (const y of range(yRange[0], yRange[1] + 1)) {
    console.log(
      range(xRange[0], xRange[1] + 1)
        .map(x => {
          const knot = knots.findIndex(k => k[0] === x && k[1] === y)
          return knot === -1 ? '.' : knot === 0 ? 'H' : knot.toString()
        })
        .join('')
    )
  }
}
