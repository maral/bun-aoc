import { Stack } from 'js-sdsl'
import range from 'lodash.range'
import shuffle from 'lodash.shuffle'

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
  const visited = new Set<string>()
  return getEnergized(input, 0, 0, 'right', visited)
}

export function partTwo(input: ReturnType<typeof parse>) {
  const visited = new Set<string>()
  let nonEmpty = 0
  const options = range(input.length)
    .map(y =>
      range(input[y]!.length).map(x =>
        directions.map(direction => [x, y, direction] as const)
      )
    )
    .flat()
    .flat()
  const shuffled = shuffle(options)

  return Math.max(
    ...shuffled.map(([x, y, direction]) => {
      const energy = getEnergized(input, x, y, direction, visited)
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
  direction: Direction,
  historicallyVisited: Set<string>
) {
  const stack = new Stack<[number, number, Direction]>()
  const visited = new Set<string>()
  const visitedFields = new Set<string>()
  if (historicallyVisited.has(getKey(x, y, direction))) {
    return 0
  }
  pushToStack(
    input,
    stack,
    visited,
    visitedFields,
    historicallyVisited,
    x,
    y,
    direction
  )

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
        historicallyVisited,
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
  historicallyVisited: Set<string>,
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
    historicallyVisited.add(key)
    visitedFields.add(fieldKey)
  }
}

function getKey(x: number, y: number, direction: Direction) {
  return `${x},${y},${direction}`
}
