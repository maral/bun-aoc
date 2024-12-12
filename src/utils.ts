/* parsing */
export function parseCharGrid(input: string) {
  return input.split('\n').map(line => line.split(''))
}

export function parseNumbersGrid(input: string, numberSeparator = ' ') {
  return input
    .split('\n')
    .map(line => line.split(numberSeparator).map(n => parseInt(n)))
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
export type Direction8 = Direction | 4 | 5 | 6 | 7

export const directionArray: Coord[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1]
]

const directions: Direction[] = [0, 1, 2, 3]
const directions8: Direction8[] = [0, 1, 2, 3, 4, 5, 6, 7]
export function get4Directions() {
  return directions
}

export function get8Directions() {
  return directions8
}

const directionNames = ['>', '^', '<', 'v']

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

export function get2DKey([x, y]: Coord) {
  return x * 10000000 + y
}
