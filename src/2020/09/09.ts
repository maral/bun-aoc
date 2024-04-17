export function parse(input: string) {
  return input.split('\n').map(Number)
}

const preamble = 25
export function partOne(input: ReturnType<typeof parse>) {
  for (let i = 0; i < input.length - preamble; i++) {
    if (!isValid(input, i)) {
      return input[i + preamble]!
    }
  }
}

export function partTwo(input: ReturnType<typeof parse>) {
  const lookingFor = partOne(input)!
  let start = 0
  let end = 0
  let sum = input[0]!
  while (start < input.length) {
    if (sum < lookingFor) {
      end++
      sum += input[end]!
    } else if (sum > lookingFor) {
      sum -= input[start]!
      start++
    } else {
      const numbers = input.slice(start, end + 1)
      return Math.min(...numbers) + Math.max(...numbers)
    }
  }
}

function isValid(input: ReturnType<typeof parse>, offset: number) {
  const current = input[offset + preamble]!
  for (let x = 0; x < preamble; x++) {
    for (let y = x + 1; y < preamble; y++) {
      if (
        input[x + offset]! + input[y + offset]! === current &&
        input[x + offset]! !== input[y + offset]!
      ) {
        return true
      }
    }
  }
  return false
}
