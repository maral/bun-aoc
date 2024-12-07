export function parse(input: string) {
  return input.split('\n').map(line => {
    const [r, x] = line.split(': ')
    return { result: parseInt(r), numbers: x.split(' ').map(n => parseInt(n)) }
  })
}

export function partOne(input: ReturnType<typeof parse>) {
  return getInputSum(input)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return getInputSum(input, true)
}

function getInputSum(input: ReturnType<typeof parse>, allowConcat = false) {
  return sum(
    input.map(({ result, numbers }) =>
      isCorrectEquation({
        result,
        numbers: numbers.slice(1),
        carry: numbers[0],
        index: 0,
        allowConcat
      })
        ? result
        : 0
    )
  )
}

function isCorrectEquation(args: {
  result: number
  numbers: number[]
  carry: number
  index: number
  allowConcat?: boolean
}): boolean {
  const { result, numbers, carry, index: i, allowConcat = false } = args
  if (i === numbers.length - 1) {
    return (
      carry + numbers[i] === result ||
      carry * numbers[i] === result ||
      (allowConcat && concatNumbers(carry, numbers[i]) === result)
    )
  }
  const nextArgs = { result, numbers, index: i + 1, allowConcat }
  return (
    isCorrectEquation({ ...nextArgs, carry: carry + numbers[i] }) ||
    isCorrectEquation({ ...nextArgs, carry: carry * numbers[i] }) ||
    (allowConcat &&
      isCorrectEquation({
        ...nextArgs,
        carry: concatNumbers(carry, numbers[i])
      }))
  )
}

// faster method added post-game using ChatGPT
const concatNumbers = (num1: number, num2: number): number => {
  const factor = Math.pow(10, Math.floor(Math.log10(num2)) + 1)
  return num1 * factor + num2
}

function sum(numbers: number[]) {
  return numbers.reduce((total, n) => total + n, 0)
}
