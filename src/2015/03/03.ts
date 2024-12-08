import { parseNumbersGrid } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('')
}

const routing: Record<string, [number, number]> = {
  '<': [-1, 0],
  '>': [1, 0],
  '^': [0, -1],
  v: [0, 1]
}

export function partOne(input: Input) {
  const position = [0, 0] as [number, number]
  const visited = new Set<number>()
  visited.add(getKey(position))
  for (const c of input) {
    move(position, c)
    visited.add(getKey(position))
  }
  return visited.size
}

export function partTwo(input: Input) {
  const p1 = [0, 0] as [number, number]
  const p2 = [0, 0] as [number, number]
  const visited = new Set<number>()
  visited.add(getKey(p1))
  let isEven = true
  for (const c of input) {
    const current = isEven ? p1 : p2
    move(current, c)
    visited.add(getKey(current))
    isEven = !isEven
  }
  return visited.size
}

function move(position: [number, number], direction: string) {
  position[0] += routing[direction]![0]
  position[1] += routing[direction]![1]
}

function getKey(position: [number, number]) {
  return position[0] * 10000000 + position[1]
}
