import { Stack } from 'js-sdsl'
import range from 'lodash.range'

type Direction = 'up' | 'down' | 'left' | 'right'

type MapSymbol = '|' | '-' | '.' | '/' | 'X'

export function parse(input: string) {
  return input.split('\n').map(line => line.split('')) as MapSymbol[][]
}

const directionMap: Record<Direction, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0]
}

const movementMap: Record<Direction, Record<MapSymbol, Direction[]>> = {
  up: {
    '|': ['up'],
    '-': ['left', 'right'],
    '.': ['up'],
    '/': ['right'],
    X: ['left']
  },
  down: {
    '|': ['down'],
    '-': ['left', 'right'],
    '.': ['down'],
    '/': ['left'],
    X: ['right']
  },
  left: {
    '|': ['up', 'down'],
    '-': ['left'],
    '.': ['left'],
    '/': ['down'],
    X: ['up']
  },
  right: {
    '|': ['up', 'down'],
    '-': ['right'],
    '.': ['right'],
    '/': ['up'],
    X: ['down']
  }
}

const directions: Direction[] = ['up', 'down', 'left', 'right']

export function partOne(input: ReturnType<typeof parse>) {
  return getEnergized(input, 0, 0, 'right')
}

export function partTwo(input: ReturnType<typeof parse>) {
  let nonEmpty = 0
  const vertical = range(input.length)
    .map(y => [
      [0, y, 'right'] as const,
      [input[y]!.length - 1, y, 'left'] as const
    ])
    .flat()
  const horizontal = range(input[0]!.length)
    .map(x => [
      [x, 0, 'down'] as const,
      [x, input[0]!.length - 1, 'up'] as const
    ])
    .flat()

  return Math.max(
    ...[...vertical, ...horizontal].map(([x, y, direction]) => {
      const energy = getEnergized(input, x, y, direction)
      if (energy > 0) {
        nonEmpty++
      }
      return energy
    })
  )
}

function getEnergized(
  input: ReturnType<typeof parse>,
  x: number,
  y: number,
  direction: Direction
) {
  const stack = new Stack<[number, number, Direction]>()
  const visited = new Set<string>()
  const visitedFields = new Set<string>()
  pushToStack(input, stack, visited, visitedFields, x, y, direction)

  while (stack.length > 0) {
    const [x, y, direction] = stack.pop()!
    const directions = movementMap[direction]![input[y]![x]!]!
    for (const newDirection of directions) {
      const [dx, dy] = directionMap[newDirection]
      pushToStack(
        input,
        stack,
        visited,
        visitedFields,
        x + dx,
        y + dy,
        newDirection
      )
    }
  }
  return visitedFields.size
}

function pushToStack(
  input: ReturnType<typeof parse>,
  stack: Stack<[number, number, Direction]>,
  visited: Set<string>,
  visitedFields: Set<string>,
  x: number,
  y: number,
  direction: Direction
) {
  const key = getKey(x, y, direction)
  const fieldKey = `${x},${y}`
  if (
    !visited.has(key) &&
    x >= 0 &&
    y >= 0 &&
    y < input.length &&
    x < (input[y]?.length ?? 0)
  ) {
    stack.push([x, y, direction])
    visited.add(key)
    visitedFields.add(fieldKey)
  }
}

function getKey(x: number, y: number, direction: Direction) {
  return `${x},${y},${direction}`
}
