import range from 'lodash.range'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n\n').map(part => {
    const [, s, o, t, tr, fa] = part.split('\n')
    const [op, x] = o.slice('  Operation: new = old '.length).split(' ')
    return {
      items: s
        .slice('  Starting items: '.length)
        .split(', ')
        .map(n => Number(n)),
      operation: op,
      operand: x === 'old' ? ('old' as const) : Number(x),
      test: Number(t.slice('  Test: divisible by '.length)),
      trueMonkey: Number(tr.slice('    If true: throw to monkey '.length)),
      falseMonkey: Number(fa.slice('    If false: throw to monkey '.length))
    }
  })
}

export function partOne(input: Input) {
  return getMonkeyBusinessLevel(input, 20, true)
}

export function partTwo(input: Input) {
  return getMonkeyBusinessLevel(input, 10000, false)
}

function getMonkeyBusinessLevel(
  input: Input,
  rounds: number,
  hasRelief: boolean
) {
  const divisor = input.reduce((prev, monkey) => prev * monkey.test, 1)
  const inspections = new Array(input.length).fill(0)
  for (const _ of range(rounds)) {
    for (const [id, monkey] of input.entries()) {
      const oldItems = monkey.items
      monkey.items = []
      for (const item of oldItems) {
        inspections[id]++
        const operand = monkey.operand === 'old' ? item : monkey.operand
        const worriedItem =
          monkey.operation === '*' ? operand * item : operand + item
        const processedItem = hasRelief
          ? Math.floor(worriedItem / 3)
          : worriedItem

        input[
          processedItem % monkey.test === 0
            ? monkey.trueMonkey
            : monkey.falseMonkey
        ].items.push(processedItem % divisor)
      }
    }
  }
  inspections.sort((a, b) => b - a)
  return inspections[0] * inspections[1]
}
