type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split(',').map(n => parseInt(n))
}

export function partOne(input: Input) {
  return getNthNumber(input, 2020)
}

export function partTwo(input: Input) {
  return getNthNumber(input, 30000000)
}

function getNthNumber(input: Input, n: number) {
  const lastTurns = new Map<number, number>()
  let i = 0
  let lastNumber = -1
  while (true) {
    let currentNumber = -1
    if (i < input.length) {
      currentNumber = input[i]
    } else {
      if (lastTurns.has(lastNumber)) {
        currentNumber = i - lastTurns.get(lastNumber)!
      } else {
        currentNumber = 0
      }
    }
    lastTurns.set(lastNumber, i)
    lastNumber = currentNumber
    i++

    if (i === n) {
      break
    }
  }
  return lastNumber
}
