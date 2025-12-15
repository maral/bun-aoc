import {
  cloneMap,
  Coord,
  get2DKey,
  get4Directions,
  keyToCoord,
  parseNumbersGrid,
  printMap,
  step
} from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseNumbersGrid(input, '')
}

export function partOne(input: Input) {
  const visible = new Set<number>()
  for (const d of ['up', 'down', 'left', 'right'] as const) {
    addVisibleTrees(input, visible, d)
  }
  for (const [y, line] of input.entries()) {
    let height = -1
    for (const [x, tree] of line.entries()) {
      if (tree > height) {
        visible.add(get2DKey([x, y]))
        height = tree
      }
    }
    height = -1
    for (const [x, tree] of line.entries()) {
      Array.from(line.entries()).toReversed()
    }
  }

  return visible.size
}

function addVisibleTrees(
  input: Input,
  visible: Set<number>,
  direction: 'up' | 'down' | 'left' | 'right'
) {
  const horizontal = direction === 'left' || direction === 'right'
  const reversed = direction === 'up' || direction === 'right'
  for (let i = 0; i < (horizontal ? input.length : input[0].length); i++) {
    let height = -1
    for (let j = 0; j < (horizontal ? input[0].length : input.length); j++) {
      const x = horizontal ? (reversed ? input[0].length - j - 1 : j) : i
      const y = horizontal ? i : reversed ? input.length - j - 1 : j
      if (input[y][x] > height) {
        visible.add(get2DKey([x, y]))
        height = input[y][x]
      }
    }
  }
}

export function partTwo(input: Input) {
  let bestScore = 0
  for (const [x, row] of input.entries()) {
    for (const [y, tree] of row.entries()) {
      let score = 1
      for (const d of get4Directions()) {
        let pos: Coord = [x, y]
        let steps = 0
        let height = input[y][x]

        while (true) {
          const [x1, y1] = step(pos, d, steps + 1)
          const newTree = input[y1]?.[x1]
          if (newTree === undefined) {
            break
          }
          steps++
          if (newTree >= height) {
            break
          }
        }
        score *= steps
      }
      bestScore = Math.max(score, bestScore)
    }
  }
  return bestScore
}
