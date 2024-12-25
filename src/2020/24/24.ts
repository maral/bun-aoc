import { Coord, get2DKey, keyToCoord } from '../../utils'

type Input = ReturnType<typeof parse>

const moves: Record<string, Coord> = {
  se: [0, 1],
  sw: [-1, 1],
  nw: [0, -1],
  ne: [1, -1],
  e: [1, 0],
  w: [-1, 0]
}

export function parse(input: string) {
  return input
    .split('\n')
    .map(line => Array.from(line.matchAll(/se|sw|nw|ne|e|w/g)).map(m => m[0]))
}

export function partOne(input: Input) {
  return getBlackTiles(input).size
}

export function partTwo(input: Input, days = 100) {
  let currentBlackTiles = getBlackTiles(input)
  for (let i = 0; i < days; i++) {
    const nextBlackTiles = new Set<number>()
    const tilesToCheck = new Set<number>(currentBlackTiles)
    currentBlackTiles.forEach(tile =>
      getNeighborKeys(tile).forEach(neighbor => tilesToCheck.add(neighbor))
    )

    for (const tile of tilesToCheck) {
      const isBlack = currentBlackTiles.has(tile)
      const neighborCount = getBlackNeighborCount(tile, currentBlackTiles)
      if (
        (isBlack && (neighborCount >= 1 && neighborCount <= 2)) ||
        (!isBlack && neighborCount === 2)
      ) {
        nextBlackTiles.add(tile)
      }
    }
    currentBlackTiles = nextBlackTiles
  }
  return currentBlackTiles.size
}

function getBlackTiles(input: Input) {
  const blackTiles = new Set<number>()
  for (const line of input) {
    let [x, y] = [0, 0]
    for (const move of line) {
      x += moves[move][0]
      y += moves[move][1]
    }
    const key = get2DKey([x, y])
    if (blackTiles.has(key)) {
      blackTiles.delete(key)
    } else {
      blackTiles.add(key)
    }
  }
  return blackTiles
}

function getBlackNeighborCount(key: number, blackTiles: Set<number>) {
  return getNeighborKeys(key).reduce(
    (sum, current) => sum + (blackTiles.has(current) ? 1 : 0),
    0
  )
}

function getNeighborKeys(key: number) {
  const [x, y] = keyToCoord(key)
  return Object.values(moves).map(([dx, dy]) => get2DKey([x + dx, y + dy]))
}
