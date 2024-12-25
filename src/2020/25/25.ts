type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n').map(line => parseInt(line))
}

export function partOne(input: Input) {
  let current = 1
  let loopSize = 0
  let loopSizes = [0, 0]
  while (true) {
    loopSize++
    current = (7 * current) % 20201227

    if (current === input[0] && loopSizes[0] === 0) {
      loopSizes[0] = loopSize
    }

    if (current === input[1] && loopSizes[1] === 0) {
      loopSizes[1] = loopSize
    }

    if (loopSizes[0] !== 0 && loopSizes[1] !== 0) {
      return transformSubjectNumber(input[0], loopSizes[1])
    }
  }
}

function transformSubjectNumber(n: number, loopSize: number) {
  let current = 1
  for (let i = 0; i < loopSize; i++) {
    current = (n * current) % 20201227
  }
  return current
}
