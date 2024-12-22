import range from 'lodash.range'
import { sum } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n').map(n => parseInt(n))
}

export function partOne(input: Input) {
  let sum = 0
  for (const n of input) {
    let number = n
    for (const i of range(2000)) {
      number = nextSecret(number)
    }
    sum += number
  }
  return sum
}

export function partTwo(input: Input) {
  const bigDiff = new Map<number, number>()
  for (const n of input) {
    const diffLog = new Set<number>()
    const secrets = [n]
    for (const i of range(1, 2001)) {
      secrets.push(nextSecret(secrets[secrets.length - 1]))
      const lastIndex = secrets.length - 1
      if (lastIndex >= 4) {
        const key = getKey(secrets, lastIndex)
        if (!diffLog.has(key)) {
          diffLog.add(key)
          bigDiff.set(key, (bigDiff.get(key) ?? 0) + (secrets[lastIndex] % 10))
        }
      }
    }
  }

  return Math.max(...Array.from(bigDiff.values()))
}

function getKey(secrets: number[], index: number) {
  return sum(
    range(4).map(
      i =>
        ((secrets[index - 3 + i] % 10) - (secrets[index - 4 + i] % 10)) *
        19 ** i
    )
  )
}

function nextSecret(number: number) {
  const first = mixAndPrune(number * 64, number)
  const second = mixAndPrune(Math.floor(first / 32), first)
  return mixAndPrune(second * 2048, second)
}

function mixAndPrune(thisNumber: number, secret: number) {
  return ((thisNumber ^ secret) >>> 0) % 16777216
}
