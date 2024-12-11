import { parseNumbersGrid, sum } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseNumbersGrid(input)[0]
}

export function partOne(input: Input, rounds = 25) {
  return sum(input.map(s => getStoneCount(s, rounds)))
}

export function partTwo(input: Input, rounds = 75) {
  return sum(input.map(s => getStoneCount(s, rounds)))
}

const cache = new Map<number, number>()

function getStoneCount(stone: number, rounds: number) {
  if (rounds === 0) {
    return 1
  }
  if (cache.has(getCacheKey(stone, rounds))) {
    return cache.get(getCacheKey(stone, rounds))!
  }
  const result: number =
    stone === 0
      ? getStoneCount(1, rounds - 1)
      : isEvenStone(stone)
        ? getStoneCount(getLeftHalf(stone), rounds - 1) +
          getStoneCount(getRightHalf(stone), rounds - 1)
        : getStoneCount(stone * 2024, rounds - 1)
  cache.set(getCacheKey(stone, rounds), result)
  return result
}

function isEvenStone(stone: number) {
  return (Math.floor(Math.log10(stone)) + 1) % 2 === 0
}

function getLeftHalf(stone: number) {
  return Math.floor(
    stone / Math.pow(10, Math.floor((Math.log10(stone) + 1) / 2))
  )
}

function getRightHalf(stone: number) {
  return stone % Math.pow(10, Math.floor((Math.log10(stone) + 1) / 2))
}

function getCacheKey(stone: number, rounds: number) {
  return (stone + 1) * 100 + rounds
}
