import { Coord, DirectionName, parseCharGrid, stepByName } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseCharGrid(input)
}

const dirs: Record<string, DirectionName> = {
  U: '^',
  R: '>',
  D: 'v',
  L: '<'
}

export function partOne(input: Input) {
  const map = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]

  let position: Coord = [1, 1]

  const code: number[] = []
  for (const line of input) {
    for (const char of line) {
      const [x, y] = stepByName(position, dirs[char])
      if (map[y]?.[x] !== undefined) {
        position = [x, y]
      }
    }
    code.push(map[position[1]][position[0]])
  }
  return code.join('')
}

export function partTwo(input: Input) {
  const map = [
    [0, 0, 1, 0, 0],
    [0, 2, 3, 4, 0],
    [5, 6, 7, 8, 9],
    [0, 'A', 'B', 'C', 0],
    [0, 0, 'D', 0, 0]
  ]

  let position: Coord = [0, 2]

  const code: (number | string)[] = []
  for (const line of input) {
    for (const char of line) {
      const [x, y] = stepByName(position, dirs[char])
      if (map[y]?.[x] !== undefined && map[y]?.[x] !== 0) {
        position = [x, y]
      }
    }
    code.push(map[position[1]][position[0]])
  }
  return code.join('')
}
