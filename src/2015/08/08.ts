import { parseNumbersGrid } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n')
}

export function partOne(input: Input) {
  let sum = 0
  for (const line of input) {
    const realString = line
      .substring(1, line.length - 1)
      .replaceAll(/\\\\/g, 'g')
      .replaceAll(/\\x[a-f0-9]{2}/g, 'g')
      .replaceAll(/\\"/g, 'g')
    sum += line.length - realString.length
  }
  return sum
}

export function partTwo(input: Input) {
  let sum = 0
  for (const line of input) {
    const realString = `"${line
      .replaceAll(/"/g, '\\"')
      .replaceAll(/\\/g, '\\\\')
      .replaceAll(/\\"/g, 'g')}"`
    sum += realString.length - line.length
  }
  return sum
}
