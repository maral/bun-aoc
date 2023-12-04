export function parse(input: string) {
  return input.split('\n').map((line, i) => {
    const [winning, draw] = line.split(':')[1]!.split('|')
    const winningCards = lineToCards(winning!)
    return lineToCards(draw!).filter(card => winningCards.includes(card)).length
  })
}

export function partOne(input: ReturnType<typeof parse>): number {
  let sum = 0
  input.forEach(numberOfWinningCards => {
    sum += numberOfWinningCards > 0 ? Math.pow(2, numberOfWinningCards - 1) : 0
  })
  return sum
}

export function partTwo(input: ReturnType<typeof parse>): number {
  const copies = Array(input.length).fill(1)
  input.forEach((numberOfWinningCards, i) => {
    for (let j = 0; j < numberOfWinningCards; j++) {
      copies[i + j + 1] += copies[i]
    }
  })
  return copies.reduce((prev, curr) => prev + curr, 0)
}

function lineToCards(line: string): number[] {
  return line
    .trim()
    .split(/\s+/)
    .map(card => parseInt(card))
}
