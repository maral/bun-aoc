import { parseCharGrid, sum } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseCharGrid(input)
}

export function partOne(input: Input) {
  let beams = new Set([input[0].findIndex(char => char === 'S')])
  let splits = 0
  for (const line of input.slice(1)) {
    const nextBeams = new Set<number>()
    for (const beam of beams.values()) {
      if (line[beam] === '^') {
        splits++
        if (beam > 0) {
          nextBeams.add(beam - 1)
        }
        if (beam < line.length - 1) {
          nextBeams.add(beam + 1)
        }
      } else {
        nextBeams.add(beam)
      }
    }
    beams = nextBeams
  }
  return splits
}

export function partTwo(input: Input) {
  let beams = new Map<number, number>([
    [input[0].findIndex(char => char === 'S'), 1]
  ])
  let splits = 0
  for (const line of input.slice(1)) {
    const nextBeams = new Map<number, number>()
    for (const beam of beams.keys()) {
      const prev = beams.get(beam)!
      if (line[beam] === '^') {
        splits++
        if (beam > 0) {
          nextBeams.set(beam - 1, prev + (nextBeams.get(beam - 1) ?? 0))
        }
        if (beam < line.length - 1) {
          nextBeams.set(beam + 1, prev + (nextBeams.get(beam + 1) ?? 0))
        }
      } else {
        nextBeams.set(beam, prev + (nextBeams.get(beam) ?? 0))
      }
    }
    beams = nextBeams
  }
  return sum(beams.values())
}
