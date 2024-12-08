import { Stack } from 'js-sdsl'
import range from 'lodash.range'

type Input = ReturnType<typeof parse>

const movePattern = /move (\d+) from (\d+) to (\d+)/

export function parse(input: string) {
  const [containersRaw, instructionsRaw] = input.split('\n\n')
  const lines = containersRaw.split('\n').slice(0, -1)
  const size = (lines[0].length + 1) / 4

  return {
    stacks: range(size).map(
      stackIndex =>
        new Stack(
          lines
            .map(
              (_, lineIndex) =>
                lines[lines.length - lineIndex - 1][stackIndex * 4 + 1]
            )
            .filter(c => c !== ' ')
        )
    ),
    instructions: instructionsRaw.split('\n').map(line =>
      movePattern
        .exec(line)!
        .slice(1)
        .map(n => parseInt(n))
    )
  }
}

export function partOne({ instructions, stacks }: Input) {
  for (const [quantity, from, to] of instructions) {
    for (const _ in range(quantity)) {
      stacks[to - 1].push(stacks[from - 1].pop()!)
    }
  }

  return stacks.map(stack => stack.top()!).join('')
}

export function partTwo({ instructions, stacks }: Input) {
  for (const [quantity, from, to] of instructions) {
    const helpStack = new Stack<string>()

    range(quantity).forEach(_ => helpStack.push(stacks[from - 1].pop()!))
    range(quantity).forEach(_ => stacks[to - 1].push(helpStack.pop()!))
  }

  return stacks.map(stack => stack.top()!).join('')
}
