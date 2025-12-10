import { sum } from '@/utils'
import { Queue } from 'js-sdsl'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n').map(line => {
    const parts = line.split(' ')
    return {
      goal: setBits(
        0,
        parts[0]
          .slice(1, parts[0].length - 1)
          .split('')
          .map((state, index) => [state, index] as [string, number])
          .filter(([state]) => state === '#')
          .map(([, index]) => index)
      ),
      bitButtons: parts
        .slice(1, parts.length - 1)
        .map(button =>
          button
            .slice(1, button.length - 1)
            .split(',')
            .map(n => Number(n))
        )
        .map(lights => setBits(0, lights)),
      buttons: parts.slice(1, parts.length - 1).map(button =>
        button
          .slice(1, button.length - 1)
          .split(',')
          .map(n => Number(n))
      ),
      joltages: parts[parts.length - 1]
        .slice(1, parts[parts.length - 1].length - 1)
        .split(',')
        .map(n => Number(n))
    }
  })
}

export function partOne(input: Input) {
  return sum(input.map(getSteps))
}

function getSteps({ goal, bitButtons }: Input[0]) {
  if (goal === 0) {
    return 0
  }

  const stateMap = new Map<number, { steps: number; edges: Set<number> }>()
  const numbersToProcess = new Queue([0])
  stateMap.set(0, { steps: 0, edges: new Set() })

  while (numbersToProcess.size() > 0) {
    const from = numbersToProcess.pop()!
    const { steps, edges } = stateMap.get(from)!
    for (const button of bitButtons) {
      const to = from ^ button
      if (to === goal) {
        return steps + 1
      }
      if (!stateMap.has(to)) {
        numbersToProcess.push(to)
        stateMap.set(to, { steps: steps + 1, edges: new Set() })
      }

      edges.add(to)
      stateMap.get(to)!.edges.add(from)
    }
  }
  return Infinity
}

export function partTwo(input: Input) {
  let total = 0
  for (const line of input) {
    const value = getSteps2(line)
    total += value
    console.log(value)
  }
  // return sum(input.map(getSteps2))
  return total
}

function getSteps2({ buttons, joltages }: Input[0]) {
  const stateMap = new Map<string, { steps: number; edges: Set<string> }>()
  const goal = getJoltageKey(joltages)
  const start = getJoltageKey(new Array(joltages.length).fill(0))
  const statesToProcess = new Queue([start])
  stateMap.set(start, { steps: 0, edges: new Set() })

  while (statesToProcess.size() > 0) {
    const from = statesToProcess.pop()!
    console.log(from)
    const { steps, edges } = stateMap.get(from)!
    for (const button of buttons) {
      const to = pushButton(from, button)
      if (to === goal) {
        return steps + 1
      }
      if (!stateMap.has(to)) {
        statesToProcess.push(to)
        stateMap.set(to, { steps: steps + 1, edges: new Set() })
      }

      edges.add(to)
      stateMap.get(to)!.edges.add(from)
    }
  }
  return Infinity
}

function pushButton(joltageKey: string, button: number[]) {
  const values = getJoltageValues(joltageKey)
  for (const i of button) {
    values[i]++
  }
  return getJoltageKey(values)
}

function getJoltageKey(joltages: number[]) {
  return joltages.join(',')
}

function getJoltageValues(joltageKey: string) {
  return joltageKey.split(',').map(n => Number(n))
}

function unsetBits(value: number, bits: number[]) {
  return bits.reduce((carry, bit) => unsetBit(carry, bit), value)
}

function toggleBits(value: number, bits: number[]) {
  return bits.reduce((carry, bit) => toggleBit(carry, bit), value)
}

function setBits(value: number, bits: number[]) {
  return bits.reduce((carry, bit) => setBit(carry, bit), value)
}

function setBit(value: number, bit: number) {
  return value | (1 << bit)
}

function unsetBit(value: number, bit: number) {
  return value & ~(1 << bit)
}

function toggleBit(value: number, bit: number) {
  return value ^ (1 << bit)
}
