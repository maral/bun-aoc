type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input
}

export function partOne(input: Input) {
  return findStartSequence(input, 4)
}

function findStartSequence(input: Input, length: number) {
  for (let i = 3; i < input.length; i++) {
    if (allUnique(input, i, length)) {
      return i + 1
    }
  }
  return 0
}

function allUnique(input: string, end: number, length: number) {
  return (
    new Set(input.substring(end - length + 1, end + 1).split('')).size ===
    length
  )
}

export function partTwo(input: Input) {
  return findStartSequence(input, 14)
}
