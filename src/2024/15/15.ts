import range from 'lodash.range'
import {
  cartesian,
  Coord,
  DirectionName,
  parseCharGrid,
  stepByName,
  sum
} from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  const [map, instructions] = input.split('\n\n')
  return {
    map: parseCharGrid(map),
    instructions: instructions
      .split('\n')
      .flatMap(line => line.split('')) as DirectionName[]
  }
}

export function partOne({ map, instructions }: Input) {
  let position = findStart(map)
  map[position[1]][position[0]] = '.'
  for (const instruction of instructions) {
    let endPosition = stepByName(position, instruction)
    let boxCount = 0
    while (true) {
      const [x, y] = endPosition
      if (map[y][x] === '#') {
        break
      } else if (map[y][x] === '.') {
        position = stepByName(position, instruction)
        if (boxCount > 0) {
          // move boxes
          map[position[1]][position[0]] = '.'
          map[endPosition[1]][endPosition[0]] = 'O'
        }
        break
      }
      boxCount++
      endPosition = stepByName(endPosition, instruction)
    }

    // printMap(map, position)
  }

  return sum(
    map.flatMap((line, y) =>
      line.map((char, x) => (char === 'O' ? y * 100 + x : 0))
    )
  )
}

export function findStart(map: string[][]): Coord {
  for (const [y, x] of cartesian([range(map.length), range(map[0].length)])) {
    if (map[y][x] === '@') {
      return [x, y]
    }
  }
  return [1, 1]
}

export function partTwo({ map: origMap, instructions }: Input) {
  let map = doubleMap(origMap)
  let position = findStart(map)
  map[position[1]][position[0]] = '.'
  for (const direction of instructions) {
    ;({ map, position } = robotStep(map, position, direction))
  }

  return sum(
    map.flatMap((line, y) =>
      line.map((char, x) => (char === '[' ? y * 100 + x : 0))
    )
  )
}

export function robotStep(
  map: string[][],
  position: Coord,
  direction: DirectionName
): { map: string[][]; position: Coord } {
  const isVertical = ['^', 'v'].includes(direction)
  const nextMap = cloneMap(map)

  if (isVertical) {
    // vertical movement
    const playerPosition = stepByName(position, direction)
    let endPositions = [playerPosition]
    nextMap[playerPosition[1]][playerPosition[0]] = '.'
    while (true) {
      // if any of next positions is #, break
      if (endPositions.some(([x, y]) => map[y][x] === '#')) {
        break
      }

      // expand boxes
      for (const [x, y] of endPositions) {
        if (map[y][x] === '[' || map[y][x] === ']') {
          const direction = map[y][x] === '[' ? '>' : '<'
          const expanded = stepByName([x, y], direction)
          if (!hasCoord(endPositions, expanded)) {
            endPositions.push(expanded)
            // clear the freed up space
            nextMap[expanded[1]][expanded[0]] = '.'
          }
        }
      }

      // change map
      // add next end positions
      const nextPositions: Coord[] = []
      for (const [x, y] of endPositions) {
        const [nx, ny] = stepByName([x, y], direction)
        if (map[y][x] !== '.') {
          nextMap[ny][nx] = map[y][x]
          nextPositions.push([nx, ny])
        }
      }

      // check if all next positions are free
      if (endPositions.every(([x, y]) => map[y][x] === '.')) {
        return {
          position: playerPosition,
          map: nextMap
        }
      }

      endPositions = nextPositions
    }
  } else {
    // horizontal movement
    let endPosition = stepByName(position, direction)
    let boxCount = 0

    while (true) {
      const [x, y] = endPosition
      if (map[y][x] === '#') {
        break
      }

      if (map[y][x] === '.') {
        if (boxCount > 0) {
          // move boxes (from the back)
          const oppositeDirection = direction === '<' ? '>' : '<'
          for (const i of range(boxCount)) {
            const nextPosition = stepByName(endPosition, oppositeDirection)
            nextMap[endPosition[1]][endPosition[0]] =
              map[nextPosition[1]][nextPosition[0]]
            endPosition = nextPosition
          }
        }
        const playerPosition = stepByName(position, direction)
        nextMap[playerPosition[1]][playerPosition[0]] = '.'
        return {
          map: nextMap,
          position: playerPosition
        }
      }
      boxCount++
      endPosition = stepByName(endPosition, direction)
    }
  }
  return { map, position }
}

export function printMap(map: string[][], position?: Coord) {
  process.stdout.write(
    map
      .map((line, y) =>
        line
          .map((char, x) =>
            position && position[0] === x && position[1] === y ? '@' : char
          )
          .join('')
      )
      .join('\n')
  )
}

function cloneMap(map: string[][]) {
  return map.map(line => [...line])
}

function hasCoord(coords: Coord[], [x, y]: Coord) {
  return coords.filter(([fx, fy]) => x === fx && y === fy).length > 1
}

export function doubleMap(map: string[][]): string[][] {
  return map.map(line =>
    line.flatMap(char =>
      char === '#'
        ? ['#', '#']
        : char === '.'
          ? ['.', '.']
          : char === 'O'
            ? ['[', ']']
            : ['@', '.']
    )
  )
}
