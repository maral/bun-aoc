export function parse(input: string) {
  return input.split('\n').map(Number)
}

export function partOne(input: ReturnType<typeof parse>) {
  input.sort((a, b) => a - b)
  let ones = 0,
    threes = 1
  for (let i = 0; i < input.length; i++) {
    const diff = i === 0 ? input[i]! : input[i]! - input[i - 1]!
    if (diff === 1) {
      ones++
    } else if (diff === 3) {
      threes++
    } else {
      console.log(
        `Difference of ${diff}! The numbers are ${input[i]!} and ${input[
          i + 1
        ]!}`
      )
    }
  }
  return ones * threes
}

export function partTwo(input: ReturnType<typeof parse>) {
  input.push(0)
  input.sort((a, b) => a - b)
  cache = new Map<number, number>()
  const result = getPossibilities(input, 0)
  return result
}

let cache = new Map<number, number>()

function getPossibilities(
  input: ReturnType<typeof parse>,
  offset: number
): number {
  if (cache.has(offset)) {
    return cache.get(offset)!
  }

  let possibilities = 1
  if (offset <= input.length - 2) {
    possibilities = getPossibilities(input, offset + 1)
  }

  if (offset <= input.length - 3 && input[offset + 2]! - input[offset]! <= 3) {
    possibilities += getPossibilities(input, offset + 2)
  }

  if (offset <= input.length - 4 && input[offset + 3]! - input[offset]! <= 3) {
    possibilities += getPossibilities(input, offset + 3)
  }

  return cache.set(offset, possibilities).get(offset)!
}
