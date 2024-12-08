type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n')
}

type MaskChar = 'X' | '1' | '0'
type Mask = Record<MaskChar, bigint[]>

export function partOne(input: Input) {
  const memory = new Map<bigint, bigint>()
  let mask: Mask = createEmptyMask()
  for (const instruction of input) {
    if (instruction[1] === 'a') {
      mask = instructionToMask(instruction)
    } else if (instruction[1] === 'e') {
      const { address, value } = instructionToAssignment(instruction)
      memory.set(address, setBits(unsetBits(value, mask[0]), mask[1]))
    }
  }
  return sumMemoryValue(memory)
}

export function partTwo(input: Input) {
  const memory = new Map<bigint, bigint>()
  let mask: Mask = createEmptyMask()
  for (const instruction of input) {
    if (instruction[1] === 'a') {
      mask = instructionToMask(instruction)
    } else if (instruction[1] === 'e') {
      const { address, value } = instructionToAssignment(instruction)
      saveFloatingValue({
        address: setBits(address, mask[1]),
        index: 0,
        bits: mask['X'],
        memory,
        value
      })
    }
  }
  return sumMemoryValue(memory)
}

function saveFloatingValue(params: {
  address: bigint
  index: number
  bits: bigint[]
  memory: Map<bigint, bigint>
  value: bigint
}) {
  const { address, index, bits, memory, value } = params
  if (index === 0 && bits.length === 0) {
    memory.set(address, value)
  }
  if (index === bits.length - 1) {
    memory.set(unsetBit(address, bits[index]), value)
    memory.set(setBit(address, bits[index]), value)
  } else {
    saveFloatingValue({
      ...params,
      address: unsetBit(address, bits[index]),
      index: index + 1
    })
    saveFloatingValue({
      ...params,
      address: setBit(address, bits[index]),
      index: index + 1
    })
  }
}

function unsetBits(value: bigint, bits: bigint[]) {
  return bits.reduce((carry, bit) => unsetBit(carry, bit), value)
}

function setBits(value: bigint, bits: bigint[]) {
  return bits.reduce((carry, bit) => setBit(carry, bit), value)
}

function setBit(value: bigint, bit: bigint) {
  return value | (1n << bit)
}

function unsetBit(value: bigint, bit: bigint) {
  return value & ~(1n << bit)
}

function instructionToMask(instruction: string) {
  const mask: Record<MaskChar, bigint[]> = createEmptyMask()
  instruction
    .substring(7)
    .split('')
    .forEach((c, i) => mask[c as MaskChar].push(BigInt(35 - i)))

  return mask
}

function instructionToAssignment(instruction: string) {
  const x = instruction.split('] = ')
  return { address: BigInt(x[0].substring(4)), value: BigInt(x[1]) }
}

function createEmptyMask(): Mask {
  return {
    '0': [],
    '1': [],
    X: []
  }
}

function sumMemoryValue(memory: Map<bigint, bigint>) {
  return memory
    .values()
    .toArray()
    .reduce((total, n) => total + n, 0n)
}
