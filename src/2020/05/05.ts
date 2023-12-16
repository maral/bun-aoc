import range from "lodash.range"

export function parse(input: string) {
  return input.split('\n')
}

export function partOne(input: ReturnType<typeof parse>) {
  return Math.max(...getSeatIds(input))
}

export function partTwo(input: ReturnType<typeof parse>) {
  const seatIds = getSeatIds(input)
  const set = new Set(seatIds)
  const max = Math.max(...seatIds)
  return range(0, max).filter(id => !set.has(id) && set.has(id - 1) && set.has(id + 1))[0]
}

function getSeatIds(input: ReturnType<typeof parse>) {
  return input.map(
    seat =>
      seat
        .substring(0, 7)
        .split('')
        .reduce(
          (sum, char, index) => sum + (char === 'B' ? 2 ** (6 - index) : 0),
          0
        ) *
        8 +
      seat
        .substring(7, 10)
        .split('')
        .reduce(
          (sum, char, index) => sum + (char === 'R' ? 2 ** (2 - index) : 0),
          0
        )
  )
}