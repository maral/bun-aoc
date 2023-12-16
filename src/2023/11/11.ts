import { Queue } from 'js-sdsl'

export function parse(input: string) {
  const original = input.split('\n').map(line => line.split(''))
  const newMap: string[][] = []
  for (let i = 0; i < original.length; i++) {
    if (original[i]?.every(sign => sign === '.')) {
      newMap.push(original[i]!.map(() => 'X'))
    } else {
      newMap.push(original[i]!)
    }
  }

  const emptyColumns = new Set<number>()
  for (let i = 0; i < newMap[0]!.length; i++) {
    const column = newMap.map(line => line[i]!)
    if (column.every(sign => sign === '.' || sign === 'X')) {
      emptyColumns.add(i)
    }
  }

  const finalMap: string[][] = []
  for (let i = 0; i < newMap.length; i++) {
    const row: string[] = []
    for (let j = 0; j < newMap[i]!.length; j++) {
      if (emptyColumns.has(j)) {
        row.push('X')
      } else {
        row.push(newMap[i]![j]!)
      }
    }
    finalMap.push(row)
  }

  return finalMap
}

export function partOne(input: ReturnType<typeof parse>) {
  return getSums(input, 2)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return getSums(input, 1000000)
}

export function getSums(input: ReturnType<typeof parse>, xValue: number) {
  let sum = 0
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y]!.length; x++) {
      if (input[y]![x] === '#') {
        sum += getLengths([x, y], input, xValue)
      }
    }
  }
  return sum / 2
}

const offsets: [number, number][] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0]
]

function getLengths(
  start: [number, number],
  input: ReturnType<typeof parse>,
  xValue: number
) {
  // BFS
  const queue = new Queue<[number, number, number]>()
  const visited = new Set<string>()
  pushToQueue(start, -1, queue, input, visited, xValue)

  let sum = 0
  while (queue.size() > 0) {
    const [x, y, length] = queue.pop()!

    if (input[y]![x] === '#') {
      sum += length
    }

    for (const offset of offsets) {
      const [newX, newY] = [x + offset[0], y + offset[1]]
      pushToQueue([newX, newY], length, queue, input, visited, xValue)
    }
  }

  return sum
}

function pushToQueue(
  position: [number, number],
  length: number,
  queue: Queue<[number, number, number]>,
  input: ReturnType<typeof parse>,
  visited: Set<string>,
  xValue: number
) {
  const [x, y] = position
  const key = `${x},${y}`
  if (
    x >= 0 &&
    y >= 0 &&
    x < input[0]!.length &&
    y < input.length &&
    !visited.has(key)
  ) {
    visited.add(key)
    queue.push([x, y, length + (input[y]![x] === 'X' ? xValue : 1)])
  }
}

function printMap(map: string[][]) {
  console.log(map.map(line => line.join('')).join('\n') + '\n')
}
