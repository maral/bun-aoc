import { Queue } from 'js-sdsl'

const offsets: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
]

export function parse(input: string) {
  return input.split('\n')
}

export function partOne(input: ReturnType<typeof parse>) {
  const startY = input.findIndex(line => line.includes('S'))
  const startX = input[startY]!.indexOf('S')
  return stepsThroughMaze(input, startX, startY, 64, 'even')
}

const mapOffsets: [number, number][] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
]

export function partTwo(input: ReturnType<typeof parse>) {
  return getOptionsForInfiniteFarm(input, 26501365)
}

export function getOptionsForInfiniteFarm(
  input: ReturnType<typeof parse>,
  maxSteps: number
) {
  // we count with a square maze with the start in the middle, free edges and free paths in all directions
  // from start to an edge
  const middle = (input.length - 1) / 2
  const size = input.length
  const start = maxSteps % 2 === 0 ? 'even' : 'odd'
  const startSum = stepsThroughMaze(input, middle, middle, maxSteps, start)

  const stepSums = mapOffsets
    .map(([dx, dy]) => {
      const x = dx === -1 ? input[0]!.length - 1 : dx === 1 ? 0 : middle
      const y = dy === -1 ? input.length - 1 : dy === 1 ? 0 : middle
      const oddSum = stepsThroughMaze(input, x, y, maxSteps, 'odd')
      const evenSum = stepsThroughMaze(input, x, y, maxSteps, 'even')

      let result = 0
      if (isDiagonal(dx, dy)) {
        const initialSteps = size + 1
        const steps = Math.floor((maxSteps - initialSteps - size + 1) / size)
        const firstRemainder = maxSteps - (initialSteps + steps * size)
        const firstRemainderCount = steps + 1

        const secondRemainder = firstRemainder - size
        const secondRemainderCount =
          firstRemainder >= size ? firstRemainderCount + 1 : 0

        result =
          getDiagonalSum(steps, oddSum, evenSum, start) +
          firstRemainderCount *
            stepsThroughMaze(
              input,
              x,
              y,
              firstRemainder,
              firstRemainder % 2 === 0 ? 'even' : 'odd'
            ) +
          secondRemainderCount *
            stepsThroughMaze(
              input,
              x,
              y,
              secondRemainder,
              secondRemainder % 2 === 0 ? 'even' : 'odd'
            )
      } else {
        const initialSteps = middle + 1
        const steps = Math.floor((maxSteps - initialSteps) / size)
        const remainder = maxSteps - (initialSteps + steps * size)

        result =
          getStraightSum(
            steps,
            oddSum,
            evenSum,
            (middle + 1) % 2 === 0 ? start : opposite(start)
          ) +
          stepsThroughMaze(
            input,
            x,
            y,
            remainder,
            remainder % 2 === 0 ? 'even' : 'odd'
          )
      }
      return result
    })
    .reduce((sum, x) => sum + x, 0)
  return startSum + stepSums
}

function opposite(x: 'odd' | 'even') {
  return x === 'odd' ? 'even' : 'odd'
}

export function getStraightSum(
  steps: number,
  odd: number,
  even: number,
  first: 'odd' | 'even'
) {
  return (
    Math.floor(steps / 2) * (odd + even) +
    (steps % 2 === 1 ? (first === 'odd' ? odd : even) : 0)
  )
}

export function getDiagonalSum(
  steps: number,
  odd: number,
  even: number,
  start: 'odd' | 'even'
) {
  const inner = Math.ceil(steps / 2) ** 2
  const outer = Math.floor(steps / 2) * (Math.floor(steps / 2) + 1)
  const odds = start === 'odd' ? inner : outer
  const evens = start === 'odd' ? outer : inner
  return odds * odd + evens * even
}

function isDiagonal(x: number, y: number) {
  return x === y || x === -y
}

function stepsThroughMaze(
  input: ReturnType<typeof parse>,
  startX: number,
  startY: number,
  maxSteps: number,
  mode: 'odd' | 'even'
) {
  const queue = new Queue<{ x: number; y: number; steps: number }>()
  const visited = new Set<string>()
  let sum = 0
  pushToQueue(input, queue, visited, startX, startY, 0, maxSteps)
  while (queue.size() > 0) {
    const { x, y, steps } = queue.pop()!
    if (steps % 2 === (mode === 'odd' ? 1 : 0)) {
      sum++
    }
    offsets.forEach(([dx, dy]) => {
      pushToQueue(input, queue, visited, x + dx, y + dy, steps + 1, maxSteps)
    })
  }
  return sum
}

function pushToQueue(
  input: string[],
  queue: Queue<{ x: number; y: number; steps: number }>,
  visited: Set<string>,
  x: number,
  y: number,
  steps: number,
  maxSteps: number
) {
  const key = getKey(x, y)
  if (visited.has(key)) {
    return
  }

  if (x >= 0 && x < input[0]!.length && y >= 0 && y < input.length && input) {
    visited.add(key)
    if (input[y]![x] !== '#' && steps <= maxSteps) {
      queue.push({ x, y, steps })
    }
  }
}

function getKey(x: number, y: number) {
  return `${x},${y}`
}
