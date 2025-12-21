import range from "lodash.range"

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input
}

export function partOne(input: Input) {
  for (const _ of range(40)) {
    input = getNextReading(input)
  }
  return input.length
}

export function getNextReading(line: string) {
  let next = ''
  let last = line[0]
  let count = 1
  for (const char of [...line.split('').slice(1), '@']) {
    if (char === last) {
      count++
    } else {
      next += `${count}${last}`
      last = char
      count = 1
    }
  }
  return next
}

export function partTwo(input: Input) {
  for (const _ of range(50)) {
    input = getNextReading(input)
  }
  return input.length
}
