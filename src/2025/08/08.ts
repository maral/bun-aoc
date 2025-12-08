import range from 'lodash.range'
import { parseNumbersGrid, product } from '../../utils'
import { PriorityQueue } from 'js-sdsl'

type Coords3D = [number, number, number]
type Pair = {
  first: number
  second: number
  distance: number
}
type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseNumbersGrid(input, ',') as Coords3D[]
}

export function partOne(input: Input, connections = 1000) {
  const { heap, circuits } = prepare(input)

  for (const _ in range(connections)) {
    const top = heap.pop()!
    const first = circuits.get(top.first)!
    const second = circuits.get(top.second)!
    if (first !== second) {
      second.values().forEach(n => {
        first.add(n)
        circuits.set(n, first)
      })
    }
  }
  const circuitLengths = [...new Set(circuits.values())].map(
    circuit => circuit.size
  )

  circuitLengths.sort((a, b) => b - a)

  return product(circuitLengths.slice(0, 3))
}

export function partTwo(input: Input) {
  const { heap, circuits } = prepare(input)

  let lastTwo = [0, 0] as [number, number]
  while (new Set(circuits.values()).size > 1) {
    const top = heap.pop()!
    const first = circuits.get(top.first)!
    const second = circuits.get(top.second)!
    if (first !== second) {
      second.values().forEach(n => {
        first.add(n)
        circuits.set(n, first)
      })
      lastTwo = [top.first, top.second]
    }
  }

  return input[lastTwo[0]][0] * input[lastTwo[1]][0]
}

function prepare(input: Input) {
  const heap = new PriorityQueue<Pair>([], (a, b) => a.distance - b.distance)
  for (const i of range(input.length)) {
    for (const j of range(input.length)) {
      if (i >= j) {
        continue
      }
      heap.push({
        first: i,
        second: j,
        distance: dist(input[i], input[j])
      })
    }
  }
  const circuits = new Map<number, Set<number>>(
    range(input.length).map(index => [index, new Set([index])])
  )
  return { heap, circuits }
}

function dist([x1, y1, z1]: Coords3D, [x2, y2, z2]: Coords3D) {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2
}
