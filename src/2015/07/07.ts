import { keyToCoord } from '../../utils'

type Input = ReturnType<typeof parse>

type GateInput =
  | {
      type: 'number'
      value: number
    }
  | {
      type: 'wire'
      value: string
    }

type BinaryGateType = 'AND' | 'OR' | 'LSHIFT' | 'RSHIFT'
type UnaryGateType = 'NOT' | 'ASSIGN'

type Gate = { value: number | undefined } & (
  | {
      type: UnaryGateType
      a: GateInput
    }
  | {
      type: BinaryGateType
      a: GateInput
      b: GateInput
    }
)

type GateMap = Record<string, Gate>

export function parse(input: string) {
  return input.split('\n').reduce((acc, line) => {
    const [exp, to] = line.split(' -> ')
    const operands = exp.split(' ')
    const [op1, op2, op3] = exp.split(' ')
    if (operands.length === 1) {
      acc[to] = { type: 'ASSIGN', a: getOperand(op1), value: undefined }
    } else if (operands.length === 2) {
      acc[to] = { type: 'NOT', a: getOperand(op2), value: undefined }
    } else {
      acc[to] = {
        type: op2 as BinaryGateType,
        a: getOperand(op1),
        b: getOperand(op3),
        value: undefined
      }
    }
    return acc
  }, {} as GateMap)
}

function getOperand(op: string): GateInput {
  return /^-?\d+$/.test(op)
    ? { type: 'number', value: parseInt(op) }
    : { type: 'wire', value: op }
}

export function partOne(input: Input) {
  return getGateValue(input.a, input)
}

export function partTwo(input: Input) {
  const inputClone = structuredClone(input)
  inputClone.b.value = getGateValue(input.a, input)
  return getGateValue(inputClone.a, inputClone)
}

function getGateValue(gate: Gate, map: GateMap): number {
  if (gate.value !== undefined) {
    return gate.value
  }
  let value = 0
  switch (gate.type) {
    case 'ASSIGN':
      value = getInput(gate.a, map)
      break
    case 'AND':
      value = getInput(gate.a, map) & getInput(gate.b, map)
      break
    case 'OR':
      value = getInput(gate.a, map) | getInput(gate.b, map)
      break
    case 'LSHIFT':
      value = getInput(gate.a, map) << getInput(gate.b, map)
      break
    case 'RSHIFT':
      value = getInput(gate.a, map) >> getInput(gate.b, map)
      break
    case 'NOT':
      value = ~getInput(gate.a, map)
      break
  }
  value = ((value % 65536) + 65536) % 65536
  gate.value = value

  return value
}

function getInput(input: GateInput, map: GateMap): number {
  return input.type === 'number'
    ? input.value
    : getGateValue(map[input.value], map)
}
