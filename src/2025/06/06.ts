import { ints, product, sum } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n')
}

export function partOne(input: Input) {
  const operands = input.slice(0, input.length - 1).map(line => ints(line))
  const operators = input[input.length - 1].split(/\s+/)
  let total = 0
  for (let i = 0; i < operators.length; i++) {
    const ops = operands.map(line => line[i])
    total += operators[i] === '*' ? product(ops) : sum(ops)
  }
  return total
}

const onlySpaces = /^\s+$/

export function partTwo(input: Input) {
  const lines = new Array(Math.max(...input.map(line => line.length))).fill('')
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      lines[j] += input[i][j]
    }
  }

  const operands: number[][] = []
  const operators: string[] = []
  let start = true
  let ops: number[] = []
  for (const line of lines) {
    if (start) {
      operators.push(line[line.length - 1])
      ops.push(Number(line.slice(0, line.length - 1)))
      start = false
    } else {
      if (onlySpaces.test(line)) {
        start = true
        operands.push(ops)
        ops = []
      } else {
        ops.push(Number(line))
      }
    }
  }
  operands.push(ops)

  let total = 0
  for (let i = 0; i < operators.length; i++) {
    const ops = operands[i]
    total += operators[i] === '*' ? product(ops) : sum(ops)
  }
  return total
}
