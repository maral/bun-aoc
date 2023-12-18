import { PriorityQueue } from 'js-sdsl'

type Direction = 'up' | 'down' | 'left' | 'right'

type Offset = {
  direction: Direction
  x: number
  y: number
}

const offsets: Offset[] = [
  { direction: 'up', x: 0, y: -1 },
  { direction: 'down', x: 0, y: 1 },
  { direction: 'left', x: -1, y: 0 },
  { direction: 'right', x: 1, y: 0 }
]

const oppositeDirection: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
}

type FieldState = {
  x: number
  y: number
  distance: number
  direction: Direction
  straightLineLength: number
  from: FieldState | null
}

export function parse(input: string) {
  return input.split('\n').map(line => line.split('').map(Number))
}

export function partOne(input: ReturnType<typeof parse>) {
  return findShortestPath(input, 0, 3)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return findShortestPath(input, 4, 10)
}

export function findShortestPath(
  input: ReturnType<typeof parse>,
  minStraightLine: number,
  maxStraightLine: number
) {
  // priority queue for adjusted Dijkstra's algorithm
  const queue = new PriorityQueue<FieldState>(
    undefined,
    (a, b) => a.distance - b.distance
  )
  const visited = new Set<string>()
  const goal = { x: input[0]!.length - 1, y: input.length - 1 }
  
  queue.push({
    x: 0,
    y: 0,
    distance: 0,
    direction: 'right',
    straightLineLength: 0,
    from: null
  })

  queue.push({
    x: 0,
    y: 0,
    distance: 0,
    direction: 'down',
    straightLineLength: 0,
    from: null
  })

  while (queue.size() > 0) {
    const current = queue.pop()!

    if (current.x === goal.x && current.y === goal.y) {
      let backtracked: FieldState | null = current
      const pathMap = input.map(line => line.map(() => ' '))
      let pathList = ''
      while (backtracked !== null) {
        pathMap[backtracked.y]![backtracked.x]! =
          backtracked.straightLineLength.toString()
        pathList += `x: ${backtracked.x}  y: ${backtracked.y}, ${backtracked.direction} - ${backtracked.straightLineLength}\n`
        backtracked = backtracked.from
      }
      console.log(pathMap.map(line => line.join('')).join('\n'))
      console.log(pathList)
      return current.distance
    }

    const key = getKey(current)
    if (visited.has(key)) {
      continue
    }

    for (const offset of offsets) {
      // if (offset.direction === getOppositeDirection(current.direction)) {
      //   continue
      // }

      if (
        offset.direction !== current.direction &&
        current.straightLineLength < minStraightLine
      ) {
        continue
      }

      const straightLineLength =
        offset.direction === current.direction
          ? current.straightLineLength + 1
          : 1
      if (straightLineLength > maxStraightLine) {
        continue
      }
      const x = current.x + offset.x
      const y = current.y + offset.y

      if (
        canVisit(x, y, offset.direction, straightLineLength, input, visited)
      ) {
        const distance = current.distance + input[y]![x]!
        queue.push({
          x,
          y,
          direction: offset.direction,
          distance,
          straightLineLength,
          from: current
        })
      }
    }
    visited.add(key)
  }
  return -1
}

function canVisit(
  x: number,
  y: number,
  direction: Direction,
  straightLineLength: number,
  input: ReturnType<typeof parse>,
  visited: Set<string>
) {
  return (
    !visited.has(
      getKey({ x, y, direction, straightLineLength, distance: 0, from: null })
    ) &&
    x >= 0 &&
    y >= 0 &&
    x < input[0]!.length &&
    y < input.length
  )
}

function getKey(fieldState: FieldState) {
  return `${fieldState.x},${fieldState.y}${fieldState.direction}${fieldState.straightLineLength}`
}

function getOppositeDirection(direction: Direction) {
  return oppositeDirection[direction]
}
