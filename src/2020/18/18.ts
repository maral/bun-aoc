import { product, sum } from '../../utils'

type Input = ReturnType<typeof parse>

type Expression = {
  operators: Operator[]
  operands: Operand[]
}

type Operand =
  | {
      type: 'number'
      value: number
    }
  | {
      type: 'expression'
      value: Expression
    }

type Operator = '*' | '+'

type SimpleEvaluator = (operators: Operator[], numbers: number[]) => number

export function parse(input: string) {
  return input.split('\n').map(line => parseExpression(line).expression)
}

export function partOne(input: Input) {
  return sum(
    input.map(exp =>
      evaluate(exp, (operators, numbers) =>
        operators.reduce(
          (acc, operator, i) =>
            operator === '*' ? acc * numbers[i + 1] : acc + numbers[i + 1],
          numbers[0]
        )
      )
    )
  )
}

export function partTwo(input: Input) {
  return sum(
    input.map(exp =>
      evaluate(exp, (operators, numbers) => {
        for (let i = 0; i < operators.length; i++) {
          const operator = operators[i]
          if (operator === '+') {
            numbers[i] += numbers[i + 1]
            numbers.splice(i + 1, 1)
            operators.splice(i, 1)
            i--
          }
        }
        return product(numbers)
      })
    )
  )
}

function evaluate(
  { operands, operators }: Expression,
  evaluator: SimpleEvaluator
): number {
  const numbers = operands.map(op =>
    op.type === 'expression' ? evaluate(op.value, evaluator) : op.value
  )

  return evaluator(operators, numbers)
}

function parseExpression(
  line: string,
  index = 0
): { expression: Expression; index: number } {
  const expression: Expression = {
    operands: [],
    operators: []
  }

  while (index < line.length) {
    switch (line[index]) {
      case ')':
        return { expression, index }
      case '(':
        const result = parseExpression(line, index + 1)
        expression.operands.push({
          type: 'expression',
          value: result.expression
        })
        index = result.index
      case ' ':
        break
      case '+':
      case '*':
        expression.operators.push(line[index] as Operator)
        break
      default:
        expression.operands.push({
          type: 'number',
          value: parseInt(line[index])
        })
        break
    }
    index++
  }
  return { expression, index }
}

function evaluateExpression(expression: string) {
  return processExpression(expression, 0)[0]
}

function processExpression(
  expression: string,
  index: number
): [number, number] {
  let value: number | null = null
  let operation: Operator | null = null
  while (index < expression.length) {
    if (expression[index] === ')') {
      break
    }

    if (expression[index] === ' ') {
      index++
      continue
    }

    if (expression[index] === '+' || expression[index] === '*') {
      operation = expression[index] as Operator
    } else {
      let nextValue = 0
      if (expression[index] === '(') {
        const [nv, nextIndex] = processExpression(expression, index + 1)
        nextValue = nv
        index = nextIndex
      } else {
        nextValue = parseInt(expression[index])
      }

      switch (operation) {
        case null:
          value = nextValue
          break
        case '*':
          value = value! * nextValue
          break
        case '+':
          value = value! + nextValue
          break
      }
    }

    index++
  }
  return [value!, index]
}
