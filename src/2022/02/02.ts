const itemPoints = {
  X: 1,
  Y: 2,
  Z: 3
}

type ItemA = 'A' | 'B' | 'C'
type ItemB = 'X' | 'Y' | 'Z'

const resultPoints: Record<ItemA, Record<ItemB, number>> = {
  A: { X: 3, Y: 6, Z: 0 },
  B: { X: 0, Y: 3, Z: 6 },
  C: { X: 6, Y: 0, Z: 3 }
}

export function parse(input: string) {
  return input.split('\n').map(line => line.split(' ') as [ItemA, ItemB])
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce((acc, [first, second]) => {
    const points = itemPoints[second!]! + resultPoints[first!]![second!]
    return acc + points
  }, 0)
}

const resultPoints2: Record<ItemB, number> = {
  X: 0,
  Y: 3,
  Z: 6
}

const itemPoints2: Record<ItemB, Record<ItemA, number>> = {
  X: { A: 3, B: 1, C: 2 },
  Y: { A: 1, B: 2, C: 3 },
  Z: { A: 2, B: 3, C: 1 }
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.reduce((acc, [first, second]) => {
    const points = resultPoints2[second!]! + itemPoints2[second!]![first!]
    return acc + points
  }, 0)
}
