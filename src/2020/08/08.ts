export function parse(input: string) {
  return input.split('\n').map(line => {
    const [instruction, value] = line.split(' ')
    return { instruction: instruction!, value: parseInt(value!) }
  })
}

export function partOne(instructions: ReturnType<typeof parse>) {
  return runProgram(instructions).acc
}

function runProgram(instructions: ReturnType<typeof parse>) {
  let line = 0
  let acc = 0
  const visited = new Set<number>()
  while (line < instructions.length) {
    if (visited.has(line)) {
      return { acc, loop: true }
    }
    visited.add(line)

    const current = instructions[line]!
    switch (current.instruction) {
      case 'nop':
        line++
        break
      case 'acc':
        acc += current.value
        line++
        break
      case 'jmp':
        line += current.value
    }
  }
  return { acc, loop: false }
}

export function partTwo(instructions: ReturnType<typeof parse>) {
  for (let index = 0; index < instructions.length; index++) {
    const line = instructions[index]!
    if (line.instruction === 'acc') {
      continue
    }
    const instruction = line.instruction === 'nop' ? 'jmp' : 'nop'

    const newProgram = [
      ...instructions.slice(0, index),
      { instruction, value: line.value },
      ...instructions.slice(index + 1)
    ]

    const result = runProgram(newProgram)
    if (result.loop === false) {
      return result.acc
    }
  }
  return 0
}
