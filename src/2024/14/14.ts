import range from 'lodash.range'
import {
  Coord,
  get2DKey,
  parseRegexNumberLine,
  product
} from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input
    .split('\n')
    .map(line => parseRegexNumberLine(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/, line))
}

export function partOne(input: Input, width = 101, height = 103, rounds = 100) {
  const quadrants = [0, 0, 0, 0]
  const midX = (width - 1) / 2
  const midY = (height - 1) / 2
  for (const line of input) {
    const [x, y] = getRobotPosition(line, [width, height], rounds)
    if (x !== midX && y !== midY) {
      quadrants[(x > midX ? 1 : 0) + (y > midY ? 1 : 0) * 2]++
    }
  }
  return product(quadrants)
}

export function partTwo(input: Input, width = 101, height = 103) {
  let rounds = 0
  while (rounds < width * height) {
    const robots = new Map<number, number>()
    for (const line of input) {
      const [x, y] = getRobotPosition(line, [width, height], rounds)
      const key = get2DKey([x, y])
      if (robots.has(key)) {
        robots.set(key, robots.get(key)! + 1)
      } else {
        robots.set(key, 1)
      }
    }

    if (input.length === robots.size) {
      for (const y of range(height)) {
        let inRow = 0
        for (const x of range(width)) {
          if (robots.has(get2DKey([x, y]))) {
            inRow++
          } else {
            inRow = 0
          }
          if (inRow > 8) {
            range(height).forEach(y1 =>
              console.log(
                range(width)
                  .map(x1 =>
                    robots.has(get2DKey([x1, y1]))
                      ? robots.get(get2DKey([x1, y1]))
                      : '.'
                  )
                  .join('')
              )
            )
            return rounds
          }
        }
      }
    }
    rounds++
  }
}

function getRobotPosition(
  [x, y, vx, vy]: number[],
  [width, height]: Coord,
  rounds: number
) {
  return [
    (((x + vx * rounds) % width) + width) % width,
    (((y + vy * rounds) % height) + height) % height
  ]
}
