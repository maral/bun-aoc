import { Stack } from 'js-sdsl'
import range from 'lodash.range'

export function parse(input: string) {
  return input.split('\n').map(line => line.split('') as Sign[])
}

type Sign = 'S' | '-' | '7' | 'F' | 'L' | 'J' | '|' | '-' | '.' | 'X'
type Direction = 'up' | 'down' | 'left' | 'right'

const directions: Direction[] = ['up', 'down', 'left', 'right']

const DirectionMap: Record<
  Direction,
  Partial<Record<Sign, Direction | null>>
> = {
  up: {
    '7': 'left',
    F: 'right',
    '|': 'up'
  },
  down: {
    L: 'right',
    J: 'left',
    '|': 'down'
  },
  left: {
    F: 'down',
    L: 'up',
    '-': 'left'
  },
  right: {
    '7': 'down',
    J: 'up',
    '-': 'right'
  }
}

export function partOne(input: ReturnType<typeof parse>, returnOutput = false) {
  const y = input.findIndex(line => line.some(sign => sign === 'S'))!
  const x = input[y]!.findIndex(sign => sign === 'S')!
  const position = [x, y]
  // a little cheat, we know that we can go right on both example and competition input
  let direction: Direction = 'right'
  let steps = 0

  const output: Sign[][] = []
  for (let i = 0; i < input.length; i++) {
    output.push(new Array(input[0]!.length).fill('.'))
  }

  do {
    if (direction === 'up') {
      position[1]!--
    }
    if (direction === 'down') {
      position[1]!++
    }
    if (direction === 'left') {
      position[0]!--
    }
    if (direction === 'right') {
      position[0]!++
    }
    const sign = input[position[1]!]![position[0]!]!
    output[position[1]!]![position[0]!] = sign
    direction = DirectionMap[direction]![sign]!
    steps++
  } while (input[position[1]!]![position[0]!] !== 'S')

  if (returnOutput) {
    return output
  }

  return steps / 2
}

const horizontalBarriers: [Set<Sign>, Set<Sign>] = [
  new Set(['-', 'L', 'F', 'S']),
  new Set(['-', 'J', '7', 'S'])
]
const verticalBarriers: [Set<Sign>, Set<Sign>] = [
  new Set(['|', '7', 'F', 'S']),
  new Set(['|', 'J', 'L', 'S'])
]

const fieldOffsets: [number, number][] = [
  [-1, -1], // top left
  [0, -1], // top right
  [-1, 0], // bottom left
  [0, 0] // bottom right
]
const offsetMap = {
  left: [fieldOffsets[0], fieldOffsets[2]],
  right: [fieldOffsets[1], fieldOffsets[3]],
  up: [fieldOffsets[0], fieldOffsets[1]],
  down: [fieldOffsets[2], fieldOffsets[3]]
}
const movementMap = {
  right: [1, 0],
  left: [-1, 0],
  up: [0, -1],
  down: [0, 1]
}

export function partTwo(input: ReturnType<typeof parse>) {
  const map = partOne(input, true) as Sign[][]

  // we go through the map on the corners of each field, so the size of the map is
  // larger by 1 in each direction

  // positions stored as "x,y"
  const visited = new Set<string>()

  // stack with the actual [x, y] positions
  const stack = new Stack<[number, number]>()

  // push all possible side positions to the stack
  range(1, map[0]!.length).forEach(x => {
    pushToStack([x, 0], stack, visited)
    pushToStack([x, map.length], stack, visited)
  })

  range(1, map.length).forEach(y => {
    pushToStack([1, y], stack, visited)
    pushToStack([map[0]!.length, y], stack, visited)
  })

  // depth first search, we paint each visited field as 'X'
  while (stack.length > 0) {
    const position = stack.pop()!

    // replace all neighboring dots by 'X'
    fieldOffsets.forEach(offset => {
      const x = position[0]! + offset[0]!
      const y = position[1]! + offset[1]!
      if (map[y]?.[x] === '.') {
        map[y]![x]! = 'X'
      }
    })

    // check all possible directions
    directions.forEach(direction => {
      const barriers =
        direction === 'up' || direction === 'down'
          ? horizontalBarriers
          : verticalBarriers
      const offsets = offsetMap[direction]
      const firstField = [
        position[0]! + offsets[0]![0]!,
        position[1]! + offsets[0]![1]!
      ] as [number, number]
      const secondField = [
        position[0]! + offsets[1]![0]!,
        position[1]! + offsets[1]![1]!
      ] as [number, number]
      if (
        isValidFieldPosition(firstField, map) &&
        isValidFieldPosition(secondField, map)
      ) {
        const firstSign = map[firstField[1]!]![firstField[0]!]!
        const secondSign = map[secondField[1]!]![secondField[0]!]!

        // now we check if there is a barrier in the current direction
        if (!barriers[0]!.has(firstSign) || !barriers[1]!.has(secondSign)) {
          const newPosition = [
            position[0] + movementMap[direction][0]!,
            position[1] + movementMap[direction][1]!
          ] as [number, number]
          pushToStack(newPosition, stack, visited)
        }
      }
    })
  }

  // count all remaining dots
  return map.reduce(
    (sum, line) =>
      sum +
      line.reduce((lineSum, sign) => (sign === '.' ? lineSum + 1 : lineSum), 0),
    0
  )
}

function isValidFieldPosition(position: [number, number], map: Sign[][]) {
  return (
    position[0] >= 0 &&
    position[1] >= 0 &&
    position[0] < map[0]!.length &&
    position[1] < map.length
  )
}

function pushToStack(
  position: [number, number],
  stack: Stack<[number, number]>,
  visited: Set<string>
) {
  const key = `${position[0]},${position[1]}`
  if (visited.has(key)) {
    return
  }
  visited.add(key)
  stack.push(position)
}

function printMap(map: Sign[][]) {
  console.log(map.map(line => line.join('')).join('\n') + '\n')
}


type LineStart = 'L' | 'F' | null

// wrote this solution after solving the challenge - I wanted to try out how difficult is it to implement
export function partTwoEasier(input: ReturnType<typeof parse>) {
  const map = partOne(input, true) as Sign[][]

  let fields = 0
  for (let y = 0; y < map.length; y++) {
    let crossings = 0
    let lineStart: LineStart = null
    for (let x = 0; x < map[0]!.length; x++) {
      if (map[y]![x] === 'L' || map[y]![x] === 'F') {
        lineStart = map[y]![x]! as LineStart
      }
      if (map[y]![x] === 'J') {
        if (lineStart === 'F') {
          crossings++
        }
        lineStart = null
      }
      if (map[y]![x] === '7') {
        if (lineStart === 'L') {
          crossings++
        }
        lineStart = null
      }
      if (map[y]![x] === '|') {
        crossings++
      }
      if (map[y]![x] === '.' && crossings % 2 === 1) {
        fields++
      }
    }
  }

  return fields
}
