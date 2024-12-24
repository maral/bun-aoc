type Input = ReturnType<typeof parse>

type BinaryGateType = 'AND' | 'OR' | 'XOR'

type Gate = {
  type: BinaryGateType
  a: string
  b: string
}

type GateMap = Record<string, Gate>

export function parse(input: string) {
  const [first, second] = input.split('\n\n')
  const fixedValues = first.split('\n').reduce((acc, line) => {
    const [to, val] = line.split(': ')
    acc.set(to, parseInt(val))
    return acc
  }, new Map<string, number>())
  const gateMap = parseGateMap(second)
  return {
    fixedValues,
    gateMap,
    rawGates: second
  }
}

const swaps = [
  ['dnt', 'z15'],
  ['mcm', 'gdf'],
  ['z30', 'gwc'],
  ['z05', 'jst']
]
function parseGateMap(raw: string, renameMap?: Map<string, string>) {
  if (renameMap) {
    for (const [from, to] of renameMap) {
      raw = raw.replaceAll(from, to)
    }
  }

  const gateMap = raw.split('\n').reduce((acc, line) => {
    const [exp, to] = line.split(' -> ')
    const [a, op, b] = exp.split(' ')
    acc[to] = {
      type: op as BinaryGateType,
      a,
      b
    }

    return acc
  }, {} as GateMap)
  for (let [a, b] of swaps) {
    if (renameMap?.has(a)) {
      a = renameMap.get(a)!
    }
    if (renameMap?.has(b)) {
      b = renameMap.get(b)!
    }
    if (gateMap[a] && gateMap[b]) {
      const prevA = gateMap[a]
      gateMap[a] = gateMap[b]
      gateMap[b] = prevA
    }
  }
  return gateMap
}

export function partOne(input: Input) {
  return readNumber('z', input)
}

/*
  Note on the solution:
  I spent a long time with brute-force solution (even greatly pruned it couldn't finish),
  then I came back to the instructions and finally understood the program should actually
  work on any input, meaning it should literally add two numbers and nothing more. After
  I started decoding how the wires worked from [xyz]00 up to [xyz]03, renaming the connecting
  wires to understand how it works. I settled on the naming of [abcr]N. The rules I've found
  are as follows (except the two 00 wires which are different):
    (1) xN XOR yN -> rN
    (2) xN AND yN -> aN
    (3) c(N-1) AND rN -> bN
    (4) c(N-1) XOR rN -> zN
    (5) aN OR bN -> cN
  
  I had to think about the process for a while to fully understand it. In the end I got it.
  `c` is for carry, `r`, `a` and `b` are helper temp variables that store carry or result from
  a single iteration.
  
  After that, I started iteratively writing a code that looks at the wires where only one
  wire is unknown (and match a rule), fill in the correct name and after that rename everything
  and start over with a different rule.

  In the end I printed out the rules that didn't match the rules. Since we were meant to find
  pairs, a single swap could result in multiple wires messed up. It took some time unwinding
  the wires, in the end I just kept adding the faulty rule pairs to the `swaps` array and finished
  once everything was fine.

  The code itself doesn't really compute the solution, but I leave it here along with this
  explanation... :-)
*/
export function partTwo({ gateMap, rawGates }: Input) {
  const renameMap = new Map<string, string>()

  // xN XOR yN -> *rN*
  // xN AND yN -> *aN*
  for (const [key, { type, a, b }] of Object.entries(gateMap)) {
    if (/x\d\dy\d\d/.test([a, b].sort().join(''))) {
      const n = a.substring(1)
      if (key[0] !== 'z') {
        const newName = `${type === 'XOR' ? 'r' : 'a'}${n}`
        renameMap.set(key, newName)
      }
    }
  }

  gateMap = parseGateMap(rawGates, renameMap)

  // *c(N-1)* XOR rN -> zN
  for (const [key, { type, a, b }] of Object.entries(gateMap)) {
    if (
      type === 'XOR' &&
      key[0] === 'z' &&
      (/r\d\d/.test(a) || /r\d\d/.test(b))
    ) {
      const r = /r\d\d/.test(a) ? a : b
      const other = /r\d\d/.test(a) ? b : a
      const newName =
        'c' + (parseInt(r.substring(1)) - 1).toString().padStart(2, '0')
      renameMap.set(other, newName)
    }
  }

  gateMap = parseGateMap(rawGates, renameMap)

  for (const [key, { type, a, b }] of Object.entries(gateMap)) {
    // c(N-1) AND rN -> *bN*
    if (/c\d\dr\d\d/.test([a, b].sort().join('')) && type === 'AND') {
      const n = [a, b].sort()[1].substring(1)
      if (key[0] !== 'z' && !renameMap.has(key)) {
        const newName = `b${n}`
        renameMap.set(key, newName)
      }
    }

    // aN OR *bN* -> cN
    if (
      type === 'OR' &&
      /c\d\d/.test(key) &&
      (/a\d\d/.test(a) || /a\d\d/.test(b))
    ) {
      const thisA = /a\d\d/.test(a) ? a : b
      const other = /a\d\d/.test(a) ? b : a
      const newKey = `b${thisA.substring(1)}`
      if (!renameMap.has(newKey)) {
        renameMap.set(other, newKey)
      }
    }
  }

  gateMap = parseGateMap(rawGates, renameMap)

  // aN OR bN -> *cN* (adds more correct renames even around faulty wires)
  for (const [key, { type, a, b }] of Object.entries(gateMap)) {
    if (/a\d\db\d\d/.test([a, b].sort().join(''))) {
      const n = a.substring(1)
      const newName = `c${n}`
      if (!renameMap.has(key)) {
        renameMap.set(key, newName)
      }
    }
  }

  gateMap = parseGateMap(rawGates, renameMap)

  // print out all the messed up wires
  const allRules: string[] = []
  for (const [key, gate] of Object.entries(gateMap)) {
    const [a, b] = [gate.a, gate.b].sort()
    const test = `${a} ${gate.type} ${b} -> ${key}`
    allRules.push(test)
    if (!validGatePattern.test(test) && !test.includes('00')) {
      console.log(test)
    }
  }

  return Array.from(new Set(swaps.flat().filter(s => !/[abcr]\d\d/.test(s))))
    .sort()
    .join(',')
}

function getNumberGates(char: string, { fixedValues: values, gateMap }: Input) {
  return [...values.keys(), ...Object.keys(gateMap)]
    .filter(key => key.startsWith(char))
    .sort()
}

function readNumber(char: string, input: Input) {
  const keys = getNumberGates(char, input)
  const values = new Map<string, number>()
  const result = keys.map(key =>
    getGateValue(key, input.gateMap, input.fixedValues, values, [])
  )
  if (result.includes(-1)) {
    return -1n
  }
  return result.reduce(
    (sum, bit, index) => sum + (BigInt(bit) << BigInt(index)),
    0n
  )
}

function getGateValue(
  gateName: string,
  map: GateMap,
  fixedValues: Map<string, number>,
  values: Map<string, number>,
  visited: string[]
): number {
  if (fixedValues.has(gateName)) {
    return fixedValues.get(gateName)!
  }

  if (values.has(gateName)) {
    return values.get(gateName)!
  }

  if (visited.includes(gateName)) {
    return -1
  }
  let value = 0
  const gate = map[gateName]
  const newVisited = [...visited, gateName]
  const a = getGateValue(gate.a, map, fixedValues, values, newVisited)
  const b = getGateValue(gate.b, map, fixedValues, values, newVisited)
  if (a === -1 || b === -1) return -1
  switch (gate.type) {
    case 'AND':
      value = a && b ? 1 : 0
      break
    case 'OR':
      value = a || b ? 1 : 0
      break
    case 'XOR':
      value = a !== b ? 1 : 0
      break
  }
  values.set(gateName, value)

  return value
}

const validGatePattern =
  /x\d\d XOR y\d\d -> r\d\d|x\d\d AND y\d\d -> a\d\d|c\d\d AND r\d\d -> b\d\d|c\d\d XOR r\d\d -> z\d\d|a\d\d OR b\d\d -> c\d\d/
