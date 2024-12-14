import range from 'lodash.range'
import { cartesian, parseCharGrid, sum } from '../../utils'

type Input = ReturnType<typeof parse>
type Coord4 = [number, number, number, number]

export function parse(input: string) {
  return parseCharGrid(input)
}

export function partOne(input: Input) {
  return getActiveCubes(input)
}

function getActiveCubes(input: Input, is4D = false) {
  let state = new Set<number>()
  for (const [y, line] of input.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === '#') {
        state.add(get4DKey(x, y, 0, 0))
      }
    }
  }

  const min: Coord4 = [-1, -1, -1, is4D ? -1 : 0]
  const max: Coord4 = [input[0].length, input.length, 1, is4D ? 1 : 0]

  for (const _ of range(6)) {
    const nextState = new Set<number>()

    // printState(state, min, max, is4D)
    for (const [x, y, z, w] of cartesian(
      range(4).map(i => range(min[i], max[i] + 1))
    )) {
      if (isActive(state, x, y, z, w, is4D)) {
        min[0] = Math.min(x - 1, min[0])
        min[1] = Math.min(y - 1, min[1])
        min[2] = Math.min(z - 1, min[2])
        max[0] = Math.max(x + 1, max[0])
        max[1] = Math.max(y + 1, max[1])
        max[2] = Math.max(z + 1, max[2])
        if (is4D) {
          max[3] = Math.max(w + 1, max[3])
          min[3] = Math.min(w - 1, min[3])
        }
        nextState.add(get4DKey(x, y, z, w))
      }
    }

    state = nextState
  }
  return state.size
}

export function partTwo(input: Input) {
  return getActiveCubes(input, true)
}

function printState(
  state: Set<number>,
  min: Coord4,
  max: Coord4,
  is4D = false
) {
  for (const w of range(min[3], max[3] + 1)) {
    for (const z of range(min[2], max[2] + 1)) {
      console.log(`z=${z}${is4D ? `, w=${w}` : ''}`)
      for (const y of range(min[1], max[1] + 1)) {
        console.log(
          range(min[0], max[0] + 1)
            .map(x => (state.has(get4DKey(x, y, z, w)) ? '#' : '.'))
            .join('')
        )
      }
    }
  }
}

const neighbors3D = getNeighbors()
const neighbors4D = getNeighbors(true)

function getNeighbors(is4D = false) {
  return cartesian([
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
    is4D ? [-1, 0, 1] : [0]
  ]).filter(([x, y, z, w]) => !(x === 0 && y === 0 && z === 0 && w === 0))
}

function isActive(
  state: Set<number>,
  x: number,
  y: number,
  z: number,
  w: number,
  is4D = false
) {
  const previouslyActive = state.has(get4DKey(x, y, z, w))
  const activeNeighbors = sum(
    (is4D ? neighbors4D : neighbors3D).map(([dx, dy, dz, dw]) => {
      const value = state.has(get4DKey(x + dx, y + dy, z + dz, w + dw)) ? 1 : 0
      return value
    })
  )
  return (
    (previouslyActive && (activeNeighbors === 2 || activeNeighbors === 3)) ||
    (!previouslyActive && activeNeighbors === 3)
  )
}

const offset = 1000
function get4DKey(x: number, y: number, z: number, w: number) {
  return (
    (x + offset) * offset ** 3 +
    (y + offset) * offset ** 2 +
    (z + offset) * offset +
    w +
    offset
  )
}
