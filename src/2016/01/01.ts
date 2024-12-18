import range from 'lodash.range'
import { Coord, Direction, get2DKey, step, turn } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split(', ')
}

export function partOne(input: Input) {
  let direction: Direction = 0
  let position: Coord = [0, 0]
  for (const instruction of input) {
    const length = Number(instruction.slice(1))
    direction =
      instruction[0] === 'L' ? turn(direction, -90) : turn(direction, 90)
    position = step(position, direction, length)
  }
  return Math.abs(position[0]) + Math.abs(position[1])
}

export function partTwo(input: Input) {
  let direction: Direction = 0
  let position: Coord = [0, 0]
  const visited = new Set<number>([get2DKey(position)])
  for (const instruction of input) {
    const length = Number(instruction.slice(1))
    direction =
      instruction[0] === 'L' ? turn(direction, -90) : turn(direction, 90)
    for (const i of range(length)) {
      position = step(position, direction)
      const key = get2DKey(position)
      if (visited.has(key)) {
        return Math.abs(position[0]) + Math.abs(position[1])
      } else {
        visited.add(key)
      }
    }
  }
}
