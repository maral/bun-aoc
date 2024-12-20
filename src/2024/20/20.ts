import { Queue } from 'js-sdsl'
import range from 'lodash.range'
import {
  cartesian,
  Coord,
  findCharPosition,
  get2DKey,
  get4Directions,
  parseCharGrid,
  step
} from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseCharGrid(input)
}

export function partOne(input: Input, threshold = 100) {
  const start = findCharPosition(input, 'S')
  const end = findCharPosition(input, 'E')

  return findCheats(input, start, end, 2, threshold)
}

function findCheats(
  map: string[][],
  start: Coord,
  end: Coord,
  cheatLength = 2,
  threshold = 100
) {
  const startSteps = findMapSteps(map, start, end)
  const endSteps = findMapSteps(map, end, start)
  const fullLength = startSteps[end[1]][end[0]]
  let cheats = 0
  for (const [y, line] of map.entries()) {
    for (const [x, char] of line.entries()) {
      if (char !== '#' && startSteps[y][x] < fullLength) {
        const fromStart = startSteps[y][x]
        for (const dy of range(cheatLength + 1)) {
          for (const dx of range(cheatLength + 1 - dy)) {
            for (const [cx, cy] of getDiffCoefficients(dx, dy)) {
              const [nx, ny] = [x + dx * cx, y + dy * cy]
              const fromEnd = endSteps[ny]?.[nx] ?? 10000000
              const totalLength = fromStart + dy + dx + fromEnd
              if (fullLength - totalLength >= threshold) {
                cheats++
              }
            }
          }
        }
      }
    }
  }

  return cheats
}

function getDiffCoefficients(dx: number, dy: number) {
  return cartesian([dx === 0 ? [1] : [-1, 1], dy === 0 ? [1] : [-1, 1]])
}

function findMapSteps(map: string[][], start: Coord, end: Coord): number[][] {
  const queue = new Queue<[Coord, number]>([[start, 0] as [Coord, number]])
  const visited = new Set<number>([get2DKey(start)])

  const stepsMap = map.map(line => line.map(_ => 10000000))

  while (!queue.empty()) {
    const [position, distance] = queue.pop()!
    stepsMap[position[1]][position[0]] = distance
    for (const direction of get4Directions()) {
      const [x, y] = step(position, direction)
      const key = get2DKey([x, y])
      if (map[y]?.[x] && map[y]?.[x] !== '#' && !visited.has(key)) {
        visited.add(key)
        queue.push([[x, y], distance + 1])
      }
    }
  }
  return stepsMap
}

export function partTwo(input: Input) {
  const start = findCharPosition(input, 'S')
  const end = findCharPosition(input, 'E')

  return findCheats(input, start, end, 20)
}
