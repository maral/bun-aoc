type Direction = 'U' | 'D' | 'L' | 'R'

type DigInstruction = {
  direction: Direction
  length: number
  color: string
}

const offsets: Record<Direction, [number, number]> = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0]
}

const directions: Record<string, Direction> = {
  '0': 'R',
  '1': 'D',
  '2': 'L',
  '3': 'U'
}

export function parse(input: string) {
  return input
    .split('\n')
    .map(line => line.split(' '))
    .map(
      ([direction, length, color]) =>
        ({
          direction,
          length: parseInt(length!),
          color
        }) as DigInstruction
    )
}

export function partOne(input: ReturnType<typeof parse>) {
  return getSweepingSize(input)
}

export function partTwo(input: ReturnType<typeof parse>) {
  let position: [number, number] = [0, 0]
  const vertices: [number, number][] = [[...position]]
  let edges = 0
  for (const instruction of input) {
    const { direction, length } = decodeColor(instruction.color)
    const offset = offsets[direction]
    position[0] += offset[0] * length
    position[1] += offset[1] * length
    edges += length
    vertices.push([...position])
  }

  // shoe lace algorithm
  let area = 0
  for (let i = 0; i < vertices.length - 1; i++) {
    area +=
      vertices[i]![0] * vertices[i + 1]![1] -
      vertices[i + 1]![0] * vertices[i]![1]
  }
  return area / 2 + edges / 2 + 1
}

function decodeColor(color: string) {
  const length = parseInt(color.substring(2, 7), 16)
  const direction = directions[color[7]!]!
  return { length, direction }
}

function getSweepingSize(instructions: DigInstruction[]) {
  let position: [number, number] = [0, 0]
  let left = 0
  let top = 0
  let bottom = 0
  let right = 0
  for (const instruction of instructions) {
    const offset = offsets[instruction.direction]
    for (let i = 0; i < instruction.length; i++) {
      position[0] += offset[0]
      position[1] += offset[1]
    }
    left = Math.min(left, position[0])
    right = Math.max(right, position[0])
    top = Math.min(top, position[1])
    bottom = Math.max(bottom, position[1])
  }

  const map = create2DArray(right - left + 1, bottom - top + 1)
  position = [-left, -top]
  map[-top]![-left]! = '#'

  for (const instruction of instructions) {
    digPosition(map, position, instruction.direction, instruction.length)
  }

  // sweeping algorithm, count all # plus the fillings
  let count = 0
  for (let y = 0; y < map.length; y++) {
    let isInside = false
    let direction: Direction = 'L'
    for (let x = 0; x < map[y]!.length; x++) {
      if (map[y]![x] === '#') {
        count++
        if (isLeftEdge(map, x, y) && isRightEdge(map, x, y)) {
          isInside = !isInside
        } else if (isLeftEdge(map, x, y)) {
          direction = getEdgeDirection(map, x, y)
        } else if (isRightEdge(map, x, y)) {
          if (direction !== getEdgeDirection(map, x, y)) {
            isInside = !isInside
          }
        }
      }
      if (map[y]![x] === '.' && isInside) {
        count++
      }
    }
  }

  return count
}

function isLeftEdge(map: string[][], x: number, y: number) {
  return x > 0 && map[y]![x - 1] === '.'
}

function isRightEdge(map: string[][], x: number, y: number) {
  return x < map[y]!.length - 1 && map[y]![x + 1] === '.'
}

function getEdgeDirection(map: string[][], x: number, y: number): Direction {
  if (y > 0 && map[y - 1]![x] === '#') {
    return 'U'
  }
  if (y < map.length - 1 && map[y + 1]![x] === '#') {
    return 'D'
  }
  return 'L'
}

function digPosition(
  map: string[][],
  position: [number, number],
  direction: 'U' | 'D' | 'L' | 'R',
  length: number
) {
  const offset = offsets[direction]
  for (let i = 0; i < length; i++) {
    position[0] += offset[0]
    position[1] += offset[1]
    map[position[1]]![position[0]]! = '#'
  }
}

function create2DArray(width: number, height: number): string[][] {
  let array: string[][] = new Array(height)
  for (let i = 0; i < array.length; i++) {
    array[i] = new Array(width).fill('.')
  }
  return array
}
