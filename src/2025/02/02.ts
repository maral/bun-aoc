import range from 'lodash.range'
import { parseNumbersGrid } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split(',').map(range => range.split('-').map(n => Number(n)))
}

export function partOne(input: Input) {
  let sum = 0
  for (const [from, to] of input) {
    for (let i = from; i <= to; i++) {
      if (isInvalid(i.toString())) {
        sum += Number(i)
      }
    }
  }
  return sum
}

function isInvalid(id: string) {
  return repeats(id, id.length / 2)
}

export function partTwo(input: Input) {
  let sum = 0
  for (const [from, to] of input) {
    for (let i = from; i <= to; i++) {
      if (isInvalid2(i.toString())) {
        sum += Number(i)
      }
    }
  }
  return sum
}

function isInvalid2(id: string) {
  for (let biteSize = 0; biteSize <= id.length / 2; biteSize++) {
    if (repeats(id, biteSize)) {
      return true
    }
  }
  return false
}

function repeats(id: string, biteSize: number) {
  if (id.length % biteSize === 0) {
    let repeats = true
    for (let i = 0; i < id.length / biteSize - 1; i++) {
      if (
        id.slice(i * biteSize, (i + 1) * biteSize) !==
        id.slice((i + 1) * biteSize, (i + 2) * biteSize)
      ) {
        repeats = false
        break
      }
    }
    if (repeats) {
      return true
    }
  }
  return false
}
