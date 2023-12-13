export function parse(input: string) {
  return input.split('\n').map(line => {
    const [springMap, numbers] = line.split(' ')
    return {
      springMap: springMap!,
      sizes: numbers!.split(',').map(Number)
    }
  })
}

export function partOne(input: ReturnType<typeof parse>) {
  return input
    .map(({ springMap, sizes }) => {
      return getNumberOfCombinations(springMap, sizes)
    })
    .reduce((acc, size) => {
      return acc + size
    }, 0)
}

function getNumberOfCombinations(springMap: string, sizes: number[]): number {
  if (sizes.length === 0) {
    if (springMap.includes('#')) {
      return 0
    } else {
      return 1
    }
  }

  if (springMap.length === 0 || sumWithSpaces(sizes) > springMap.length) {
    return 0
  }

  switch (springMap[0]) {
    case '.':
      return getNumberOfCombinations(springMap.substring(1), sizes)
    case '#':
      const first = springMap.substring(0, sizes[0]!)
      if (
        first.split('').every(c => c === '#' || c === '?') &&
        (['?', '.'].includes(springMap[sizes[0]!]!) ||
          springMap.length === sizes[0]!)
      ) {
        return getNumberOfCombinations(
          springMap.substring(sizes[0]! + 1),
          sizes.slice(1)
        )
      } else {
        return 0
      }
    case '?':
      return (
        getNumberOfCombinations(springMap.substring(1), sizes) +
        getNumberOfCombinations(`#${springMap.substring(1)}`, sizes)
      )
    default:
      return 0
  }
}

export function sumWithSpaces(sizes: number[]) {
  return sizes.reduce((acc, size, i) => {
    return acc + size + (i > 0 ? 1 : 0)
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input
    .map(({ springMap, sizes }) => {
      const c = getNumberOfCombinations(
        new Array(5).fill(springMap).join('?'),
        [...sizes, ...sizes, ...sizes, ...sizes, ...sizes]
      )
      return c
    })
    .reduce((acc, size) => {
      return acc + size
    }, 0)
}
