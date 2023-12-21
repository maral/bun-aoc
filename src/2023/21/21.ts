import { Queue } from 'js-sdsl'
import exp from 'node:constants'

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
  const steps = Math.floor((maxSteps - size - 1) / size)
  const stepsToStraight = Math.floor((maxSteps - middle - 1) / size)
  console.log(steps, stepsToStraight)
  const oddSum = stepsThroughMaze(input, middle, middle, maxSteps, 'odd')
  const evenSum = stepsThroughMaze(input, middle, middle, maxSteps, 'even')
  console.log(`odd: ${oddSum} even: ${evenSum}`)
  const oddFields = steps + ((steps + 1) % 2)
  const evenFields = (steps + 1) + ((steps + 1) % 2)

  const stepSums = mapOffsets
    .map(([dx, dy]) => {
      const x = dx === -1 ? input[0]!.length - 1 : dx === 1 ? 0 : middle
      const y = dy === -1 ? input.length - 1 : dy === 1 ? 0 : middle

      let result = 0
      if (isDiagonal(dx, dy)) {
        const initialSteps = size + 1
        const steps = Math.floor((maxSteps - initialSteps) / size)
        const remainder = (maxSteps - initialSteps) % size
        const remainderCount = steps + 1

        console.log(
          `diagonal remainder: ${remainder} remainderCount: ${remainderCount}`
        )
        const oddity = (maxSteps - remainder) % 2 === 0 ? 'odd' : 'even'

        result =
          remainderCount * stepsThroughMaze(input, x, y, remainder, oddity)
      } else {
        const initialSteps = middle + 1
        const remainder = (maxSteps - initialSteps) % size

        console.log(`straight remainder: ${remainder}`)

        const oddity = (maxSteps - remainder) % 2 === 0 ? 'odd' : 'even'
        result = stepsThroughMaze(input, x, y, remainder, oddity)
      }
      console.log(result)
      return result
    })
    .reduce((sum, x) => sum + x, 0)
  console.log(steps, oddSum, evenSum, oddFields, evenFields, stepSums)
  const straightDiff =
    stepsToStraight === steps + 1
      ? 0
      : -4 * (stepsToStraight % 2 === 0 ? evenSum : oddSum)

  const odd = oddSum * oddFields ** 2
  const even = evenSum * evenFields ** 2
  return (
    oddSum * oddFields ** 2 +
    evenSum * evenFields ** 2 +
    stepSums +
    straightDiff
  )
}

export function getStraightSum(steps: number, odd: number, even: number) {
  return Math.floor(steps / 2) * (odd + even) + (steps % 2 === 0 ? 0 : odd)
}

export function getDiagonalSum(steps: number, odd: number, even: number) {
  const odds = Math.ceil(steps / 2)
  const evens = Math.floor(steps / 2)
  return odds * odds * odd + evens * (evens + 1) * even
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
