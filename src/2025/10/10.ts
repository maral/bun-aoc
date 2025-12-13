import { cartesian, sum } from '@/utils'
import { Queue } from 'js-sdsl'
import range from 'lodash.range'

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
  return sum(input.map(getFewestPresses))
}

function getFewestPresses({ goal, bitButtons }: Input[0]) {
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
  const results: number[] = []
  for (const line of input) {
    const presses = configureJoltageLevels(line)
    results.push(presses)
    total += presses
  }

  return total
}

function configureJoltageLevels(input: Input[0]) {
  const { joltages } = input
  const matrix = createAndWorkOutMatrix(input)
  const { solutions, freeVariables } = getSolutionFormulas(matrix, input)
  return getMinimalSolution(solutions, freeVariables, Math.max(...joltages))
}

type SolutionFn = (params: Map<number, number>, solutions: number[]) => number

function createAndWorkOutMatrix({ buttons, joltages }: Input[0]) {
  const matrix = joltages.map((j, i) => [
    ...buttons.map(button => (button.includes(i) ? 1 : 0)),
    j
  ])

  // solve matrix
  // -->
  for (let i = 0; i < joltages.length - 1; i++) {
    sortMatrix(matrix)
    // |
    // v
    const firstCol = matrix[i].findIndex(n => n !== 0)
    for (let j = i + 1; j < joltages.length; j++) {
      if (matrix[j][firstCol] !== 0) {
        const c = matrix[j][firstCol] / matrix[i][firstCol]

        // -->
        for (let z = firstCol; z < buttons.length + 1; z++) {
          matrix[j][z] = matrix[j][z] - c * matrix[i][z]
        }
      }
    }
  }
  sortMatrix(matrix)

  // remove useless rows (should be all 0s)
  const width = matrix[0].length - 1
  const height = matrix.length
  matrix.splice(width, height - width)
  return matrix
}

function getSolutionFormulas(matrix: number[][], { buttons }: Input[0]) {
  const solutions: SolutionFn[] = new Array<SolutionFn>(buttons.length).fill(
    () => 0
  )
  const paramIndexes = new Set<number>()

  // work out solutions (formulas)
  let foundSolutions = 0
  for (let i = matrix.length - 1; i >= 0; i--) {
    const line = matrix[i]
    const firstNonZeroIndex = line.findIndex(n => n !== 0)
    if (firstNonZeroIndex === -1) {
      continue
    }
    const expectedOffset = buttons.length - foundSolutions
    if (firstNonZeroIndex + 1 < expectedOffset) {
      for (let j = firstNonZeroIndex + 1; j < expectedOffset; j++) {
        paramIndexes.add(j)
        solutions[j] = params => params.get(j)!
        foundSolutions++
      }
    }

    if (firstNonZeroIndex < buttons.length - foundSolutions) {
      solutions[buttons.length - foundSolutions - 1] = (params, solutions) => {
        const others = range(firstNonZeroIndex + 1, buttons.length)
          .toReversed()
          .map(k => line[k] * solutions[k])
        return line[line.length - 1] - sum(others)
      }
      foundSolutions++
    }
  }

  return { solutions, freeVariables: Array.from(paramIndexes) }
}

function getMinimalSolution(
  solutions: SolutionFn[],
  freeVariables: number[],
  maxJoltage: number
) {
  const params = new Map(freeVariables.map(i => [i, 0]))

  const variants = cartesian(freeVariables.map(() => range(0, maxJoltage + 1)))
  if (variants.length === 0) {
    variants.push([])
  }

  let min = Infinity
  let lastSolution: number[] = []
  for (const variant of variants) {
    // set params to variant
    freeVariables.forEach((p, index) => {
      params.set(p, variant[index])
    })

    const solution: number[] = new Array(solutions.length).fill(0)
    for (const i of range(solutions.length).toReversed()) {
      solution[i] = solutions[i](params, solution)
    }

    if (
      solution.every(n => n >= -0.0001 && Math.abs(n - Math.round(n)) <= 0.0001)
    ) {
      if (sum(solution) < min) {
        lastSolution = solution.map(n => Math.round(n))
        min = Math.min(sum(lastSolution), min)
      }
    }
  }

  return min
}

function normalize(n: number) {
  if (Math.abs(n - Math.round(n)) < 0.0001) {
    return Math.round(n)
  }
  return n
}

function sortMatrix(matrix: number[][]) {
  for (const [i, line] of matrix.entries()) {
    for (const [, n] of line.entries()) {
      if (n !== 0) {
        if (n !== 1) {
          for (const [z, x] of line.entries()) {
            matrix[i][z] = normalize(x / n)
          }
        }
        break
      }
    }
  }
  matrix.sort(
    (a, b) =>
      sum(b.map((n, index) => n * 100 ** (b.length - index))) -
      sum(a.map((n, index) => n * 100 ** (a.length - index)))
  )
}

function printMatrix(matrix: number[][]) {
  for (const line of matrix) {
    console.log(
      `(${numberForPrint(line[0], 2)}${line
        .slice(1, line.length - 1)
        .map(n => numberForPrint(n))
        .join('')} |${numberForPrint(line[line.length - 1])} )`
    )
  }
}

function numberForPrint(n: number, width = 4) {
  return (n === 0 ? 0 : n).toString().padStart(width, ' ')
}

function setBits(value: number, bits: number[]) {
  return bits.reduce((carry, bit) => setBit(carry, bit), value)
}

function setBit(value: number, bit: number) {
  return value | (1 << bit)
}

function verifySolution(
  solution: number[],
  buttons: Input[0]['buttons'],
  joltages: Input[0]['joltages']
) {
  const state = [...joltages]
  for (const [i, button] of buttons.entries()) {
    for (const bit of button) {
      state[bit] -= solution[i]
    }
  }
  return state.every(n => Math.abs(n) < 0.0001)
}
