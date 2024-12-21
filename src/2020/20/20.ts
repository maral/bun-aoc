import range from 'lodash.range'
import { Coord, ints, printMap, product, sum } from '../../utils'

type Input = ReturnType<typeof parse>

const tileSize = 10

export function parse(input: string) {
  return input.split('\n\n').map(tile => {
    const [n, ...grid] = tile.split('\n')
    return {
      id: ints(n)[0],
      grid
    }
  })
}

type Tile = {
  id: number
  grid: string[][]
  sides: number[]
  normalized: number[]
}

export function partOne(input: Input) {
  const { tileMap, normalizedSideMap } = preprocessTiles(input)

  return product(
    getTilesByUnpairedSidesCount(tileMap, normalizedSideMap, 2).map(
      tile => tile.id
    )
  )
}

// side indices orientation:
//  1
// 0 2
//  3

export function partTwo(input: Input) {
  const { tileMap, normalizedSideMap } = preprocessTiles(input)

  const cornerTiles = getTilesByUnpairedSidesCount(
    tileMap,
    normalizedSideMap,
    2
  )

  let firstCorner = cornerTiles[0]
  const unpairedSidesIndices = getUnpairedSidesIndices(
    firstCorner,
    normalizedSideMap
  )
  if (unpairedSidesIndices[0] === 0 && unpairedSidesIndices[1] === 3) {
    firstCorner = rotateTileClockwise(firstCorner, 1)
  } else {
    firstCorner = rotateTileClockwise(
      firstCorner,
      (4 - Math.min(...unpairedSidesIndices)) % 4
    )
  }
  const firstRow = [firstCorner]

  // fill in the first line from the left
  while (true) {
    const previous = firstRow[firstRow.length - 1]
    if (
      normalizedSideMap.get(normalizeSideValue(previous.sides[2]))!.length === 1
    ) {
      break
    }
    const next = getTileBySide(
      previous.sides[2],
      previous.id,
      tileMap,
      normalizedSideMap
    )
    firstRow.push(rearrangeTile(next, previous.sides[2], 0))
  }
  const result: Tile[][] = [firstRow]

  while (result.length < tileMap.size / firstRow.length) {
    const prevRow = result[result.length - 1]
    const row: Tile[] = []
    for (const tile of prevRow) {
      const side = tile.sides[3]
      const nextTile = getTileBySide(side, tile.id, tileMap, normalizedSideMap)
      row.push(rearrangeTile(nextTile, side, 1))
    }

    result.push(row)
  }

  printTiles(result)

  let bigGrid = result.flatMap(row =>
    range(row[0].grid.length)
      .slice(1, -1)
      .map(i => row.flatMap(tile => tile.grid[i].slice(1, -1)))
  )

  printMap(bigGrid)

  return getWaterRoughness(bigGrid)
}

function printTiles(tiles: Tile[][]) {
  for (const row of tiles) {
    row[0].grid.forEach((_, i) =>
      console.log(row.map(tile => tile.grid[i].join('')).join('|'))
    )
    console.log(row.map(tile => tile.grid[0].map(() => '-').join('')).join('+'))
  }
}

function getTileBySide(
  side: number,
  otherId: number,
  tileMap: Map<number, Tile>,
  normalizedSideMap: Map<number, number[]>
) {
  const id = normalizedSideMap
    .get(normalizeSideValue(side))!
    .filter(id => id !== otherId)[0]
  return tileMap.get(id)!
}

function getUnpairedSidesIndices(
  tile: Tile,
  normalizedSideMap: Map<number, number[]>
) {
  return tile.normalized
    .map((side, index) => [side, index])
    .filter(([side]) => normalizedSideMap.get(side)!.length === 1)
    .map(([, index]) => index)
}

function getTilesByUnpairedSidesCount(
  tileMap: Map<number, Tile>,
  normalizedSideMap: Map<number, number[]>,
  unpairedSides: number
) {
  return Array.from(
    tileMap
      .values()
      .filter(
        tile =>
          tile.normalized.filter(
            side => normalizedSideMap.get(side)!.length === 1
          ).length === unpairedSides
      )
  )
}

function getSides(tileGrid: string[]) {
  const sides = [
    tileGrid.map(line => line[0]),
    tileGrid[0].split(''),
    tileGrid.map(line => line[line.length - 1]),
    tileGrid[tileGrid.length - 1].split('')
  ]
  const regular = sides.map(side => encodeSide(side))
  return {
    regular,
    normalized: regular.map(side => normalizeSideValue(side))
  }
}

function preprocessTiles(input: Input) {
  const normalizedSideMap = new Map<number, number[]>()
  const tileMap = new Map<number, Tile>()
  for (const tile of input) {
    const { regular, normalized } = getSides(tile.grid)
    normalized.forEach(side =>
      normalizedSideMap.set(side, [
        ...(normalizedSideMap.get(side) ?? []),
        tile.id
      ])
    )
    tileMap.set(tile.id, {
      id: tile.id,
      grid: tile.grid.map(line => line.split('')),
      sides: regular,
      normalized
    })
  }
  return { normalizedSideMap, tileMap }
}

function encodeSide(side: string[]): number {
  return sum(side.entries().map(([i, s]) => (s === '#' ? 1 << i : 0)))
}

function decodeSide(n: number) {
  return range(tileSize)
    .map(i => (((n >> i) & 1) === 1 ? '#' : '.'))
    .join('')
}

function flipSide(n: number): number {
  return sum(range(tileSize).map(i => ((n >> i) & 1) << (tileSize - i - 1)))
}

function normalizeSideValue(n: number) {
  const flipped = flipSide(n)
  return Math.min(n, flipped)
}

function rearrangeTile(tile: Tile, side: number, position: number) {
  // rotate tile to put first to 0 index
  const sideNormalized = normalizeSideValue(side)
  const origIndex = tile.normalized.indexOf(sideNormalized)
  tile = rotateTileClockwise(tile, (4 + position - origIndex) % 4)

  // flip it if needed
  if (tile.sides[position] !== side) {
    const n = flipSide(tile.sides[position])
    console.assert(side === n)
    return position % 2 === 0
      ? flipTileVertically(tile)
      : flipTileHorizontally(tile)
  } else {
    return tile
  }
}

function rotateTileClockwise(tile: Tile, rotations: number) {
  if (rotations === 0) {
    return tile
  }
  const grid = rotateGridClockwise(tile.grid)
  const s = tile.sides
  const sides = [s.at(-1)!, flipSide(s[0]), s[1], flipSide(s[2])]
  const normalized = [tile.normalized.at(-1)!, ...tile.normalized.slice(0, -1)]
  return rotateTileClockwise(
    { ...tile, grid, sides, normalized },
    rotations - 1
  )
}

function rotateGridClockwise(grid: string[][]) {
  return grid[0].map((_, index) => grid.map(row => row[index]).reverse())
}

function flipTileVertically(tile: Tile) {
  const { sides, normalized } = tile
  return {
    ...tile,
    grid: flipGridVertically(tile.grid),
    sides: [flipSide(sides[0]), sides[3], flipSide(sides[2]), sides[1]],
    normalized: [normalized[0], normalized[3], normalized[2], normalized[1]]
  }
}

function flipGridVertically(grid: string[][]) {
  return grid.toReversed()
}

function flipTileHorizontally(tile: Tile) {
  const { sides, normalized } = tile
  return {
    ...tile,
    grid: tile.grid.map(row => row.toReversed()),
    sides: [sides[2], flipSide(sides[1]), sides[0], flipSide(sides[3])],
    normalized: [normalized[2], normalized[1], normalized[0], normalized[3]]
  }
}

const seaMonster = [
  '                  # ',
  '#    ##    ##    ###',
  ' #  #  #  #  #  #   '
]

const seaMonsterCoords = seaMonster
  .flatMap((row, y) =>
    row.split('').map((char, x) => (char === '#' ? ([x, y] as Coord) : null))
  )
  .filter(c => c !== null)

function findSeaMonsterCoords(map: string[][]) {
  const monsterCoords: Coord[] = []
  for (const y of range(map.length - seaMonster.length + 1)) {
    for (const x of range(map[0].length - seaMonster[0].length + 1)) {
      if (seaMonsterCoords.every(([dx, dy]) => map[y + dy][x + dx] === '#')) {
        monsterCoords.push([x, y])
      }
    }
  }
  return monsterCoords
}

function getWaterRoughness(map: string[][]) {
  const monsterMap = getMonsterOrientation(map)!

  const foundCoords = findSeaMonsterCoords(monsterMap)
  for (const [x, y] of foundCoords) {
    for (const [dx, dy] of seaMonsterCoords) {
      monsterMap[y + dy][x + dx] = 'O'
    }
  }

  printMap(monsterMap)

  return monsterMap.flatMap(row => row.filter(char => char === '#')).length
}

function getMonsterOrientation(map: string[][]) {
  if (findSeaMonsterCoords(map).length > 0) {
    return map
  }

  for (const i of range(3)) {
    map = rotateGridClockwise(map)
    if (findSeaMonsterCoords(map).length > 0) {
      return map
    }
  }

  map = flipGridVertically(map)
  if (findSeaMonsterCoords(map).length > 0) {
    return map
  }

  for (const i of range(3)) {
    map = rotateGridClockwise(map)
    if (findSeaMonsterCoords(map).length > 0) {
      return map
    }
  }
}
