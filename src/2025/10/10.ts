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
    // console.log(line.buttons.length - line.joltages.length)
    const value = getSteps2(line)
    // console.log('RESULT', value)
    total += value
  }
  // return sum(input.map(getSteps2))
  return total
}

type SolutionFn = (params: Map<number, number>, solutions: number[]) => number

function getSteps2({ buttons, joltages }: Input[0]) {
  // console.log('-------')

  // console.log(joltages.join(','))
  const matrix = joltages.map((j, i) => [
    ...buttons.map(button => (button.includes(i) ? 1 : 0)),
    j
  ])

  // solve matrix
  // -->
  for (let i = 0; i < joltages.length - 1; i++) {
    // printMatrix(matrix)
    sortMatrix(matrix)
    // console.log('-------')
    // printMatrix(matrix)
    // |
    // v
    const firstCol = matrix[i].findIndex(n => n !== 0)
    // console.log('pivot')

    // printMatrix([matrix[i]])
    for (let j = i + 1; j < joltages.length; j++) {
      if (matrix[j][firstCol] !== 0) {
        const c = matrix[j][firstCol] / matrix[i][firstCol]
        // console.log('c', c)
        // console.log('r', matrix[j][matrix[j].length - 1])

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

  const solutions: SolutionFn[] = new Array<SolutionFn>(buttons.length).fill(
    () => 0
  )
  const paramIndexes = new Set<number>()

  // abs = -1
  // -1 => (4 1 0)
  // 2 => (1 0 1)
  // --- example:
  // x = t2(1 0 1) + (4 1 0)
  // x0 = t2 + 4
  // x1 = 1
  // x2 = t2
  // ->
  // x2 > 0 -> t2 > 0
  // x0 > 0 -> t2 + 4 > 0 -> t2 > -4
  /*
  ex2:
  x = (1 0 0) + t1(0 1 -1) + t2(0 0 1)
  x0 = 1
  x1 = t1
  x2 = t2 - t1
  t1 >= 0
  t2 - t1 >= 0
  t2 > t1
  */

  // work out solutions (formulas)
  let foundSolutions = 0
  const solutionVectors = new Map<number, number[]>()
  const solutionFormulas: Map<number, number>[] = new Array(buttons.length)
    .fill(0)
    .map(() => new Map())
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
        solutionFormulas[j].set(j, 1)
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
      const following = range(
        firstNonZeroIndex + 1,
        buttons.length
      ).toReversed()
      const formula = solutionFormulas[buttons.length - foundSolutions - 1]
      formula.set(0, line[line.length - 1])
      for (const k of following) {
        const f = solutionFormulas[k]
        for (const [p, value] of f.entries()) {
          formula.set(p, -line[k] * value + (formula.get(p) ?? 0))
        }
      }
      foundSolutions++
    }
  }
  for (const f of solutionFormulas) {
    for (const [key, value] of f) {
      if (value === 0) {
        f.delete(key)
      }
    }
  }
  console.log('----')
  printMatrix(matrix)
  const paramIndexesArray = Array.from(paramIndexes).sort()
  const params = new Map(paramIndexesArray.map(i => [i, 0]))

  console.log(':::')
  const vectors: number[][] = []
  for (const i of [0, ...paramIndexesArray]) {
    const vector: number[] = []
    for (const f of solutionFormulas) {
      vector.push(f.get(i) ?? 0)
    }
    vectors.push(vector)
    console.log(`${i}: ( ${vector.join(' ')} )`)
  }
  console.log(':::')
  for (const f of solutionFormulas) {
    console.log(
      f
        .entries()
        .toArray()
        .map(([key, value]) =>
          key !== 0
            ? `${
                value === 1 ? '' : value === -1 ? '-' : `${value}`
              }${`t${key}`}`
            : value
        )
        .join(' + ')
    )
  }

  const max = Math.max(...joltages)

  // const variants = cartesian(
  //   paramIndexesArray.map(p => {
  //     let coef = 1
  //     if (
  //       matrix.some(
  //         line => 0.0001 < Math.abs(line[p]) && Math.abs(line[p]) < 0.9999
  //       )
  //     ) {
  //       const numbers = matrix.map(line => Math.abs(line[p]))
  //       console.log(numbers)
  //       coef = Math.min(coef, ...numbers.filter(n => n > 0.0001))
  //     }

  //     return range(0, Math.ceil(max * (1 / coef)) + 1).map(n => n * 0.5)
  //   })
  // )
  // if (variants.length === 0) {
  //   variants.push([])
  // }

  // let min = Infinity
  // let lastSolution: number[] = []
  // for (const variant of variants) {
  //   // set params to variant
  //   paramIndexesArray.forEach((p, index) => {
  //     params.set(p, variant[index])
  //   })

  //   const solution: number[] = new Array(solutions.length).fill(0)
  //   for (const i of range(solutions.length).toReversed()) {
  //     solution[i] = solutions[i](params, solution)
  //   }

  //   if (solution.every(n => n >= 0 && Math.abs(n - Math.round(n)) <= 0.0001)) {
  //     if (sum(solution) < min) {
  //       lastSolution = solution
  //       min = Math.min(sum(solution), min)

  //       const solution2: number[] = new Array(solutions.length).fill(0)
  //       for (const i of range(solutions.length).toReversed()) {
  //         solution2[i] = solutions[i](params, solution2)
  //         // console.log('###', i, solution2[i])
  //       }
  //     }
  //   }
  // }
  // console.log('solution', lastSolution)

  // let lastSolution = getSolution(solutions, params)
  // let negativeSum = getNegativeSum(lastSolution)
  // let min = isValid(lastSolution) ? sum(lastSolution) : Infinity
  // // first go towards all positives
  // for (const p of paramIndexesArray) {
  //   for (const c of [-1, 1]) {
  //     while (negativeSum > 0) {
  //       const prev = negativeSum
  //       console.log(negativeSum)
  //       params.set(p, params.get(p)! + c)
  //       console.log(params.values().toArray())
  //       const solution = getSolution(solutions, params)
  //       console.log(solution)
  //       printMatrix(matrix)
  //       if (getNegativeSum(solution) >= negativeSum) {
  //         params.set(p, params.get(p)! - c)
  //       } else {
  //         negativeSum = getNegativeSum(solution)
  //       }
  //     }
  //   }
  // }
  // for (const p of paramIndexesArray) {
  //   // we're already all positives, go up/down to find lowest values
  //   for (const c of [-1, 1]) {
  //     while (true) {
  //       params.set(p, params.get(p)! + c)
  //       // console.log(params.values().toArray())
  //       const solution = getSolution(solutions, params)
  //       if (!isValid(solution) || sum(solution) >= min) {
  //         params.set(p, params.get(p)! - c)
  //         break
  //       }

  //       // console.log(solution)
  //       if (isValid(solution)) {
  //         min = sum(solution)
  //         lastSolution = solution
  //       }
  //     }
  //   }
  // }
  // console.log(min)
  // console.log(lastSolution)

  // if (!verifySolution(lastSolution, buttons, joltages)) {
  //   console.log('########################')
  //   console.log('########################')
  //   console.log('########################')
  //   console.log('########################')
  //   console.log('########################')
  //   console.log('########################')
  //   console.log('########################')
  // }
  return 0 // min
}

function getSolution(solutions: SolutionFn[], params: Map<number, number>) {
  const solution: number[] = new Array(solutions.length).fill(0)
  for (const i of range(solutions.length).toReversed()) {
    solution[i] = solutions[i](params, solution)
  }
  return solution
}

function getNegativeSum(solution: number[]) {
  return sum(solution.filter(n => n < -0.0001).map(n => Math.abs(n)))
}

function isValid(solution: number[]) {
  return solution.every(n => n >= 0 && Math.abs(n - Math.round(n)) <= 0.0001)
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
