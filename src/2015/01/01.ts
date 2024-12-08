
type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('')
}

export function partOne(input: Input) {
  return input.filter(c => c === '(').length - input.filter(c => c === ')').length
}

export function partTwo(input: Input) {
  let floor = 0
  for (const [i, c] of input.entries()) {
    if (c === '(') {
      floor++
    } else {
      floor--
    }
    if (floor < 0) {
      return i + 1
    }
  }
}