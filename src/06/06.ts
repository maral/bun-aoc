import range from 'lodash.range'

export function parse(input: string) {
  return input
    .split('\n')
    .map(n => n.trim())
    .filter(n => n.length > 0)
}

export function parse1(preprocessedInput: string[]) {
  return preprocessedInput.map(line =>
    line
      .split(':')[1]!
      .split(/\s+/)
      .map(n => n.trim())
      .filter(n => n.length > 0)
      .map(Number)
  )
}

export function parse2(preprocessedInput: string[]) {
  return preprocessedInput
    .map(line =>
      line
        .split(':')[1]!
        .split(/\s+/)
        .map(n => n.trim())
        .filter(n => n.length > 0)
        .join('')
    )
    .map(Number)
}

export function partOne(input: ReturnType<typeof parse>) {
  const times = parse1(input)
  let result = 1
  for (let i = 0; i < times[0]!.length; i++) {
    const time = times[0]![i]!
    const distance = times[1]![i]!
    result *= range(0, times[0]![i])
      .map(n => (time - n) * n - distance)
      .filter(n => n > 0).length
  }
  return result
}

export function partTwo(input: ReturnType<typeof parse>) {
  const [time, distance] = parse2(input)

  // <buttonPress> * (time - <buttonPress>) - distance > 0
  // x * (time - x) - distance = 0
  // -x^2 + time * x - distance = 0
  const solutions = quadraticEquationSolution(-1, time!, -distance!)
  if (solutions.length >= 2) {
    return Math.floor(solutions[1]!) - Math.ceil(solutions[0]!) + 1
  }
}

function quadraticEquationSolution(a: number, b: number, c: number) {
  const delta = b * b - 4 * a * c
  if (delta < 0) {
    return []
  }
  if (delta === 0) {
    return [-b / (2 * a)]
  }
  return [(-b + Math.sqrt(delta)) / (2 * a), (-b - Math.sqrt(delta)) / (2 * a)]
}
