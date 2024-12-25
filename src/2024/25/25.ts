import range from 'lodash.range'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  const grids = input.split('\n\n')
  const locks: number[][] = []
  const keys: number[][] = []
  for (const grid of grids) {
    const lines = grid.split('\n')

    ;(lines[0] === '#####' ? locks : keys).push(
      range(5).map(
        i =>
          lines.reduce((sum, curr) => (curr[i] === '#' ? sum + 1 : sum), 0) - 1
      )
    )
  }
  return { locks, keys }
}

export function partOne({ locks, keys }: Input) {
  let matches = 0
  for (const lock of locks) {
    for (const key of keys) {
      if (key.every((k, i) => k + lock[i] <= 5)) {
        matches++
      }
    }
  }
  return matches
}
