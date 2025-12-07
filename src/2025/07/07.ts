import { parseCharGrid, sum } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseCharGrid(input)
}

export function partOne(input: Input) {
  return processBeams(input).splits
}

export function partTwo(input: Input) {
  return sum(processBeams(input).beams.values())
}

function processBeams(input: Input) {
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
  return { beams, splits }
}
