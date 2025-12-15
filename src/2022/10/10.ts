import { parseNumbersGrid } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n').map(line => {
    const [op, n] = line.split(' ')
    if (op === 'noop') {
      return { type: 'noop' }
    } else {
      return { type: 'addx', value: Number(n) }
    }
  })
}

export function partOne(input: Input) {
  let cycle = 0
  let sum = 0
  let x = 1
  for (const line of input) {
    cycle++
    if ((cycle - 20) % 40 === 0) {
      sum += cycle * x
    }

    if (line.type === 'noop') {
      continue
    }

    cycle++
    if ((cycle - 20) % 40 === 0) {
      sum += cycle * x
    }
    x += line.value!
  }
  return sum
}

export function partTwo(input: Input) {
  const lines: string[][] = [[]]
  let cycle = 0
  let x = 1
  for (const line of input) {
    cycle++
    lines[lines.length - 1].push(
      x <= cycle % 40 && cycle % 40 <= x + 2 ? '#' : '.'
    )
    if (cycle % 40 === 0) {
      lines.push([])
    }

    if (line.type === 'noop') {
      continue
    }

    cycle++
    lines[lines.length - 1].push(
      x <= cycle % 40 && cycle % 40 <= x + 2 ? '#' : '.'
    )
    if (cycle % 40 === 0) {
      lines.push([])
    }

    x += line.value!
  }
  lines.forEach(line => console.log(line.join('')))
}
