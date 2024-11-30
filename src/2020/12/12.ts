type Instruction = {
  letter: string
  value: number
}

const directions = ['N', 'E', 'S', 'W']

const instructionMap = {
  L: {}
}

export function parse(input: string): Instruction[] {
  return input
    .split('\n')
    .map(line => ({ letter: line[0]!, value: parseInt(line.substring(1)) }))
}

export function partOne(input: Instruction[]) {
  for (const instruction of input) {
    if (false) {
    }
  }
  return 0
}

export function partTwo(input: Instruction[]) {
  return 0
}
