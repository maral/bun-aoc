type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input
    .split('\n')
    .map(line => (line[0] === 'L' ? -1 : 1) * Number(line.slice(1)))
}

const DIAL_RANGE = 100

export function partOne(input: Input) {
  let dial = 50
  let total = 0
  for (const i of input) {
    dial = (i + dial) % DIAL_RANGE
    if (dial === 0) {
      total++
    }
  }
  return total
}

export function partTwo(input: Input) {
  let dial = 50
  let total = 0
  for (const i of input) {
    const nextState = i + dial
    if (nextState > DIAL_RANGE - 1) {
      total += Math.floor(nextState / DIAL_RANGE)
    } else if (nextState < 0) {
      total += Math.floor(-nextState / DIAL_RANGE) + (dial === 0 ? 0 : 1)
    } else if (nextState === 0) {
      total++
    }
    dial = ((nextState % DIAL_RANGE) + DIAL_RANGE) % DIAL_RANGE
  }
  return total
}
