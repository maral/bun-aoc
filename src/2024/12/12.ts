import { Stack } from 'js-sdsl'
import {
  Coord,
  Direction,
  get2DKey,
  get4Directions,
  isDirectionVertical,
  parseCharGrid,
  step
} from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseCharGrid(input)
}

export function partOne(input: Input) {
  return getTotalPrice(input)
}

export function partTwo(input: Input) {
  return getTotalPrice(input, true)
}

function getTotalPrice(input: Input, useSides = false) {
  const visited = new Set<number>()
  let sum = 0
  for (const [y, line] of input.entries()) {
    for (const [x] of line.entries()) {
      if (!visited.has(get2DKey([x, y]))) {
        sum += getRegionPrice([x, y], input, visited, useSides)
      }
    }
  }
  return sum
}

function getRegionPrice(
  position: Coord,
  input: Input,
  visited: Set<number>,
  useSides: boolean
) {
  const char = input[position[1]][position[0]]
  const regionVisited = new Set<number>()
  const walls = Object.fromEntries<Coord[]>(
    get4Directions().map(d => [d, []])
  ) as Record<Direction, Coord[]>
  const stack = new Stack<Coord>()
  let area = 0
  let perimeter = 0

  stack.push(position)
  regionVisited.add(get2DKey(position))

  while (!stack.empty()) {
    const current = stack.pop()!
    area++
    for (const d of get4Directions()) {
      const [x, y] = step(current, d)
      if (input[y]?.[x] === undefined || input[y]?.[x] !== char) {
        perimeter++
        if (useSides) {
          walls[d].push([x, y])
        }
      } else if (!regionVisited.has(get2DKey([x, y]))) {
        regionVisited.add(get2DKey([x, y]))
        stack.push([x, y])
      }
    }
  }

  regionVisited.forEach(p => visited.add(p))

  if (!useSides) {
    return area * perimeter
  }

  return area * getSidesCount(walls)
}

function getSidesCount(walls: Record<Direction, Coord[]>) {
  let sides = 0
  for (const d of get4Directions()) {
    const main = isDirectionVertical(d) ? 0 : 1
    const other = isDirectionVertical(d) ? 1 : 0
    walls[d].sort((w1, w2) => w1[main] - w2[main])
    walls[d].sort((w1, w2) => w1[other] - w2[other])

    let prevMain = -2
    let prevOther = -2
    for (const wall of walls[d]) {
      if (
        prevMain === -2 ||
        prevOther !== wall[other] ||
        wall[main] - prevMain > 1
      ) {
        sides++
      }
      prevMain = wall[main]
      prevOther = wall[other]
    }
  }
  return sides
}
