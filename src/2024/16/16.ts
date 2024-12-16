import { PriorityQueue } from 'js-sdsl'
import {
  areDirectionsOpposite,
  Coord,
  coordsEqual,
  Direction,
  DirectionName,
  findCharPosition,
  get2DKey,
  get4Directions,
  getDirectionName,
  parseCharGrid,
  step,
  stepByName
} from '../../utils'

type Input = ReturnType<typeof parse>

type FieldState = {
  position: Coord
  distance: number
  direction: Direction
  path: string
}

export function parse(input: string) {
  return parseCharGrid(input)
}

export function partOne(input: Input) {
  return findFastestPaths(input).distance
}

export function partTwo(input: Input) {
  return findFastestPaths(input).uniqueTiles
}

function findFastestPaths(input: Input): {
  distance: number
  uniqueTiles: number
} {
  const start = findCharPosition(input, 'S')
  const goal = findCharPosition(input, 'E')
  const heap = new PriorityQueue<FieldState>(
    [
      {
        position: start,
        distance: 0,
        direction: 0,
        path: ''
      } satisfies FieldState
    ],
    (x, y) => x.distance - y.distance
  )
  const visited = new Map<number, number>([[0, 0]])
  let counter = 0
  let minDistance = Infinity
  let winningPaths = []

  while (heap.size() > 0) {
    const { position, direction, distance, path } = heap.pop()!
    counter++

    if (coordsEqual(position, goal) && distance <= minDistance) {
      if (distance < minDistance) {
        minDistance = distance
        winningPaths = []
      }
      winningPaths.push(path)
      continue
    }

    for (const d of get4Directions()) {
      const nextPosition = step(position, d)
      const key = getKeyWithDirection(nextPosition, d)
      const nextDistance = direction === d ? distance + 1 : distance + 1001

      if (
        input[nextPosition[1]][nextPosition[0]] !== '#' &&
        !areDirectionsOpposite(d, direction) &&
        (!visited.has(key) || nextDistance <= visited.get(key)!)
      ) {
        const nextPath = path + getDirectionName(d)
        heap.push({
          position: nextPosition,
          direction: d,
          distance: nextDistance,
          path: nextPath
        })
        visited.set(key, nextDistance)
      }
    }
  }
  const uniqueTiles = new Set<number>()
  for (const winningPath of winningPaths) {
    let i = 0
    let pos = start
    while (i < winningPath.length) {
      uniqueTiles.add(get2DKey(pos))
      pos = stepByName(pos, winningPath[i] as DirectionName)
      i++
    }
  }
  return {
    uniqueTiles: uniqueTiles.size + 1,
    distance: minDistance
  }
}

function getKeyWithDirection([x, y]: Coord, direction: Direction) {
  return x * 1000000 + y * 4 + direction
}
