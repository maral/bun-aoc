import { Queue } from 'js-sdsl'
import range from 'lodash.range'
import {
  Coord,
  coordsEqual,
  get2DKey,
  get4Directions,
  parseNumbersGrid,
  step
} from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseNumbersGrid(input, ',')
}

export function partOne(input: Input) {
  return findFastestPath(input, 71, 71)
}

type FieldState = {
  position: Coord
  steps: number
}

export function findFastestPath(
  input: Input,
  w: number,
  h: number,
  bytes = 1024
): number {
  const map = range(h).map(_ => range(w).map(__ => '.'))

  for (const i of range(bytes)) {
    if (i >= input.length) {
      break
    }
    const [x, y] = input[i]
    map[y][x] = '#'
  }

  const start: Coord = [0, 0]
  const goal: Coord = [w - 1, h - 1]
  const queue = new Queue<FieldState>([{ position: start, steps: 0 }])
  const visited = new Set<number>([get2DKey(start)])
  let counter = 0

  while (!queue.empty()) {
    const {
      position: [x, y],
      steps
    } = queue.pop()!

    for (const d of get4Directions()) {
      const [nx, ny] = step([x, y], d)
      if ((map[ny]?.[nx] ?? '#') === '#' || visited.has(get2DKey([nx, ny]))) {
        continue
      }

      if (coordsEqual([nx, ny], goal)) {
        return steps + 1
      }
      visited.add(get2DKey([nx, ny]))
      queue.push({ position: [nx, ny], steps: steps + 1 })
    }
    counter++
  }
  return 0
}

export function partTwo(input: Input, steps = 1024) {
  const w = Math.max(...input.map(([x, _]) => x)) + 1
  const h = Math.max(...input.map(([_, y]) => y)) + 1
  let bottom = steps
  let top = input.length
  while (bottom < top - 1) {
    const i = Math.floor((bottom + top) / 2)
    if (findFastestPath(input, w, h, i) === 0) {
      top = i
    } else {
      bottom = i
    }
  }
  return input[bottom].join(',')
}
