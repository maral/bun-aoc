import range from 'lodash.range'

export function parse(input: string) {
  return input
    .split('\n\n')
    .map(pattern => pattern.split('\n').map(line => line.split('')))
}

export function partOne(input: ReturnType<typeof parse>) {
  return getResult(input, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return getResult(input, 1)
}

function getResult(input: ReturnType<typeof parse>, faults = 0) {
  return input
    .map(pattern => {
      const n =
        getVerticalMirrorPosition(pattern, faults) ||
        getVerticalMirrorPosition(transpose2dArray(pattern), faults) *
          100
      return n
    })
    .reduce((acc, x) => acc + x, 0)
}

function transpose2dArray(array: string[][]) {
  return array[0]!.map((_, i) => array.map(row => row[i]!))
}

function* getHorizontalPairsFromIndex(line: string[], index: number) {
  for (let i = 0; i <= index && index + i + 1 < line.length; i++) {
    yield [line[index - i], line[index + i + 1]]
  }
}

function getVerticalMirrorPosition(
  pattern: string[][],
  faults = 0
): number {
  const errorMap = Object.fromEntries(
    range(pattern[0]!.length - 1).map(n => [n, 0])
  )
  for (const line of pattern) {
    Object.keys(errorMap).forEach(x => {
      for (const [a, b] of getHorizontalPairsFromIndex(line, Number(x))) {
        if (a !== b) {
          errorMap[x]++
          if (errorMap[x]! > faults) {
            delete errorMap[x]
          }
          break
        }
      }
    })
    if (Object.keys(errorMap).length === 0) {
      return 0
    }
  }
  if (Object.keys(errorMap).length > 0) {
    return (
      Number(
        Object.keys(errorMap).find(key => errorMap[key]! === faults)!
      ) + 1
    )
  }
  return 0
}
