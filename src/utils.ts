import fastCartesian from 'fast-cartesian'

/* parsing */
export function parseCharGrid(input: string) {
  return input.split('\n').map(line => line.split(''))
}

export function parseNumbersGrid(input: string, numberSeparator = ' ') {
  return input
    .split('\n')
    .map(line => line.split(numberSeparator).map(n => parseInt(n)))
}

export function parseRegexNumberLine(regex: RegExp, line: string) {
  return regex
    .exec(line)!
    .slice(1)
    .map(n => parseInt(n))
}

/* results */
export function sum(numbers: number[]) {
  return numbers.reduce((total, n) => total + n, 0)
}

export function product(numbers: number[]) {
  return numbers.reduce((total, n) => total * n, 1)
}

/* grid functions */
export type Coord = [number, number]
export type Direction = 0 | 1 | 2 | 3
export type DirectionName = '>' | 'v' | '<' | '^'
export type Direction8 = Direction | 4 | 5 | 6 | 7

export const directionArray: Coord[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1]
]

export const directionMap: Record<DirectionName, Coord> = {
  '>': [1, 0],
  v: [0, 1],
  '<': [-1, 0],
  '^': [0, -1]
}

const directions: Direction[] = [0, 1, 2, 3]
const directions8: Direction8[] = [0, 1, 2, 3, 4, 5, 6, 7]
export function get4Directions() {
  return directions
}

export function get8Directions() {
  return directions8
}

export const directionNames = ['>', '^', '<', 'v']

export function getDirectionName(d: Direction) {
  return directionNames[d]
}

export function isDirectionVertical(d: Direction) {
  return d === 1 || d === 3
}

export function step(position: Coord, direction: Direction): Coord {
  return [
    position[0] + directionArray[direction][0],
    position[1] + directionArray[direction][1]
  ]
}

export function stepByName(
  position: Coord,
  directionName: DirectionName
): Coord {
  return [
    position[0] + directionMap[directionName][0],
    position[1] + directionMap[directionName][1]
  ]
}

export function get2DKey([x, y]: Coord) {
  return x * 10000000 + y
}

export function cartesian(array: number[][]): number[][] {
  return fastCartesian(array)
}
