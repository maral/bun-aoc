import { Queue } from 'js-sdsl'
import {
  Coord,
  findCharPosition,
  getDirectionNames,
  stepByName
} from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n')
}

const numpadMap = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['X', '0', 'A']
]
const arrowMap = [
  ['X', '^', 'A'],
  ['<', 'v', '>']
]

const cache = new Map<string, number>()

export function partOne(input: Input) {
  return getComplexitiesSum(input, 3)
}

export function partTwo(input: Input) {
  cache.clear()
  return getComplexitiesSum(input, 26)
}

function getComplexitiesSum(input: Input, maxLevel = 3) {
  let total = 0
  for (const code of input) {
    const numericalValue = parseInt(code)
    let price = findShortestCodePath(code, maxLevel)
    total += price * numericalValue
  }
  return total
}

function findShortestCodePath(
  code: string,
  maxLevel: number,
  level = 0
): number {
  if (level === maxLevel) {
    return code.length
  }
  let prev = 'A'
  let sum = 0
  for (const char of code.split('')) {
    sum += findShortestCharPath(prev, char, maxLevel, level)
    prev = char
  }
  return sum
}

function findShortestCharPath(
  from: string,
  to: string,
  maxLevel: number,
  level = 0
): number {
  const key = `${level};${from};${to}`
  if (cache.has(key)) {
    return cache.get(key)!
  }

  // find all possible paths
  let minPrice = Infinity
  for (const path of findPaths(from, to, level)) {
    const price = findShortestCodePath(path, maxLevel, level + 1)
    if (price < minPrice) {
      minPrice = price
    }
  }

  cache.set(key, minPrice)
  return minPrice
}

const numpadPathsCache = new Map<string, string[]>()
const numpadPositionsCache = new Map<string, Coord>()

const arrowsPathsCache = new Map<string, string[]>()
const arrowsPositionsCache = new Map<string, Coord>()

type FieldState = {
  char: string
  position: Coord
  visited: string
  path: string
}
function findPaths(from: string, to: string, level: number): string[] {
  const pathsCache = level === 0 ? numpadPathsCache : arrowsPathsCache
  const key = `${from}${to}`
  if (pathsCache.has(key)) {
    return pathsCache.get(key)!
  }

  const map = level === 0 ? numpadMap : arrowMap
  const start = findPosition(from, level)
  const queue = new Queue<FieldState>([
    { char: from, position: start, path: '', visited: from }
  ])
  const paths = new Map<string, string[]>()
  let minLength = 100
  while (!queue.empty()) {
    const { char, position, path, visited } = queue.pop()!
    const p = paths.get(char) ?? paths.set(char, []).get(char)!
    p.push(path)
    if (minLength === 100 && char === to) {
      minLength = path.length
    }
    for (const d of getDirectionNames()) {
      const next = stepByName(position, d)
      const nextChar = map[next[1]]?.[next[0]] ?? 'X'
      if (
        nextChar !== 'X' &&
        !visited.includes(nextChar) &&
        path.length + 1 <= minLength
      ) {
        queue.push({
          char: nextChar,
          position: next,
          path: path + d,
          visited: visited + nextChar
        })
      }
    }
  }
  const result = paths.get(to)!.map(p => p + 'A')
  pathsCache.set(key, result)
  return result
}

function findPosition(char: string, level: number): Coord {
  const positionsCache =
    level === 0 ? numpadPositionsCache : arrowsPositionsCache
  const map = level === 0 ? numpadMap : arrowMap
  return (
    positionsCache.get(char) ??
    positionsCache.set(char, findCharPosition(map, char)).get(char)!
  )
}
