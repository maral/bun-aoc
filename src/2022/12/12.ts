import { Queue } from 'js-sdsl'
import {
  Coord,
  coordsEqual,
  findCharPosition,
  get2DKey,
  get4Directions,
  parseCharGrid,
  step
} from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  const grid = parseCharGrid(input)
  return {
    start: findCharPosition(grid, 'S'),
    end: findCharPosition(grid, 'E'),
    map: parseCharGrid(input).map(line =>
      line.map(c => c.replace('S', 'a').replace('E', 'z').charCodeAt(0) - 97)
    )
  }
}

export function partOne({ start, end, map }: Input) {
  const queue = new Queue<{ position: Coord; steps: number; height: number }>([
    { position: start, steps: 0, height: 0 }
  ])
  const visited = new Set<number>()
  visited.add(get2DKey(start))
  while (queue.size() > 0) {
    const { position, steps, height } = queue.pop()!
    for (const d of get4Directions()) {
      const newPosition = step(position, d)
      const [x, y] = newPosition
      const key = get2DKey(newPosition)
      if (visited.has(key)) {
        continue
      }
      const newHeight = map[y]?.[x]
      if (newHeight !== undefined && newHeight <= height + 1) {
        if (coordsEqual(newPosition, end)) {
          return steps + 1
        }
        queue.push({
          position: newPosition,
          steps: steps + 1,
          height: newHeight
        })
        visited.add(key)
      }
    }
  }
  return Infinity
}

export function partTwo({ end, map }: Input) {
  let min = Infinity
  for (const [y, line] of map.entries()) {
    for (const [x, height] of line.entries()) {
      if (height === 0) {
        min = Math.min(min, partOne({ start: [x, y], end, map }))
      }
    }
  }
  return min
}
