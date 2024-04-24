export function parse(input: string) {
  return input.split('\n').map(line => line.split(''))
}

export function partOne(input: ReturnType<typeof parse>) {
  return getFinalOccupiedSeats(input, getOccupiedSeats, 4)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return getFinalOccupiedSeats(input, getOccupiedSeatsLookup, 5)
}

function getFinalOccupiedSeats(
  input: ReturnType<typeof parse>,
  getOccupiedSeats: (
    input: ReturnType<typeof parse>,
    x: number,
    y: number
  ) => number,
  occupiedLimit: number
) {
  let rounds = 0
  while (true) {
    const next = input.map(arr => [...arr])
    rounds++
    let hasChanged = false
    for (let y = 0; y < input.length; y++) {
      for (let x = 0; x < input[0]!.length; x++) {
        const char = input[y]![x]!
        if (char === '.') {
          continue
        }
        const occupied = getOccupiedSeats(input, x, y)
        if (char === 'L' && occupied === 0) {
          hasChanged = true
          next[y]![x]! = '#'
        }

        if (char === '#' && occupied >= occupiedLimit) {
          hasChanged = true
          next[y]![x]! = 'L'
        }
      }
    }
    input = next
    if (!hasChanged) {
      break
    }
    console.log(input.map(l => l.join('')).join('\n') + '\n')
  }

  return input.reduce(
    (sum, curr) =>
      sum + curr.reduce((occ, seat) => occ + (seat === '#' ? 1 : 0), 0),
    0
  )
}

const offsets = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
]

function getOccupiedSeats(
  input: ReturnType<typeof parse>,
  x: number,
  y: number
) {
  return offsets
    .map(([ox, oy]) => [x + ox!, y + oy!])
    .filter(
      ([x, y]) =>
        x! >= 0 && y! >= 0 && x! < input[0]!.length && y! < input.length
    )
    .map(([x, y]) => input[y!]![x!]!)
    .filter(char => char === '#').length
}

function getOccupiedSeatsLookup(
  input: ReturnType<typeof parse>,
  x: number,
  y: number
) {
  return offsets
    .map(([ox, oy]) => getFirstSeat(input, x, y, ox!, oy!))
    .filter(char => char === '#').length
}

function getFirstSeat(
  input: ReturnType<typeof parse>,
  x: number,
  y: number,
  dx: number,
  dy: number
): string | null {
  while (true) {
    x += dx
    y += dy
    if (x < 0 || y < 0 || x >= input[0]!.length || y >= input.length) {
      return null
    }
    const char = input[y]![x]!
    if (char !== '.') {
      return char
    }
  }
}
