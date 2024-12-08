import { parseCharGrid } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseCharGrid(input)
}

export function partOne(input: Input) {
  return getAntidoteCount(input)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return getAntidoteCount(input, true)
}

function getAntidoteCount(input: Input, repeat = false) {
  const antidotes = new Set<number>()
  const antennaMap = getAntennaMap(input)

  for (const antennas of antennaMap.values()) {
    for (const [i, antennaA] of antennas.entries()) {
      for (const [j, antennaB] of antennas.entries()) {
        if (i < j) {
          setPairAntidotes(antidotes, antennaA, antennaB, input, repeat)
        }
      }
    }
  }
  return antidotes.size
}

function getAntennaMap(input: Input) {
  const antennaMap = new Map<string, [number, number][]>()
  for (const [y, line] of input.entries()) {
    for (const [x, char] of line.entries()) {
      if (char !== '.') {
        if (!antennaMap.has(char)) {
          antennaMap.set(char, [])
        }
        antennaMap.get(char)!.push([x, y])
      }
    }
  }
  return antennaMap
}

function setPairAntidotes(
  antidotes: Set<number>,
  a: [number, number],
  b: [number, number],
  input: Input,
  repeat: boolean
) {
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]

  setOneDirectionAntidotes(antidotes, a, [dx, dy], 1, input, repeat)
  setOneDirectionAntidotes(antidotes, b, [dx, dy], -1, input, repeat)
}

function setOneDirectionAntidotes(
  antidotes: Set<number>,
  start: [number, number],
  diff: [number, number],
  direction: number,
  input: ReturnType<typeof parse>,
  repeat: boolean
) {
  let i = repeat ? 0 : 1
  while (true) {
    const x = start[0] + diff[0] * direction * i
    const y = start[1] + diff[1] * direction * i
    if (input[y]?.[x]) {
      antidotes.add(x * 1000000 + y)
      input[y][x] = '#'
      if (repeat) {
        i++
      } else {
        break
      }
    } else {
      break
    }
  }
}
