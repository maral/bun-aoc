import range from 'lodash.range'
import { cartesian, cloneMap, parseCharGrid, sum } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseCharGrid(input)
}

const dirs = cartesian([
  [-1, 0, 1],
  [-1, 0, 1]
]).filter(dir => dir[0] !== 0 || dir[1] !== 0)

export function partOne(input: Input) {
  const { cleared } = step(input)
  return cleared
}

export function partTwo(input: Input) {
  let total = 0
  let map = input
  while (true) {
    const { cleared, next } = step(map)
    if (cleared === 0) {
      break
    }
    total += cleared
    map = next
  }
  return total
}

function step(input: Input) {
  let cleared = 0
  const next = cloneMap(input)
  for (const row of range(input.length)) {
    for (const col of range(input[row].length)) {
      if (
        input[row][col] === '@' &&
        sum(
          dirs.map(neighbor =>
            input[row + neighbor[1]]?.[col + neighbor[0]] === '@' ? 1 : 0
          )
        ) < 4
      ) {
        next[row][col] = '.'
        cleared++
      }
    }
  }
  return { cleared, next }
}
