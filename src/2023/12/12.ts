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
  const cache = new Map<string, number>()
  return input
    .map(({ springMap, sizes }) => {
      return getNumberOfCombinations(springMap, sizes, cache)
    })
    .reduce((acc, size) => {
      return acc + size
    }, 0)
}

function getNumberOfCombinationsCached(
  springMap: string,
  sizes: number[],
  cache: Map<string, number>
): number {
  const cacheKey = `${springMap}-${sizes.join(',')}`

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!
  }

  const result = getNumberOfCombinations(springMap, sizes, cache)
  cache.set(cacheKey, result)
  return result
}

function getNumberOfCombinations(
  springMap: string,
  sizes: number[],
  cache: Map<string, number>
): number {
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
      return getNumberOfCombinationsCached(springMap.substring(1), sizes, cache)
    case '#':
      const first = springMap.substring(0, sizes[0]!)
      if (
        first.split('').every(c => c === '#' || c === '?') &&
        (['?', '.'].includes(springMap[sizes[0]!]!) ||
          springMap.length === sizes[0]!)
      ) {
        return getNumberOfCombinationsCached(
          springMap.substring(sizes[0]! + 1),
          sizes.slice(1),
          cache
        )
      } else {
        return 0
      }
    case '?':
      return (
        getNumberOfCombinationsCached(springMap.substring(1), sizes, cache) +
        getNumberOfCombinationsCached(
          `#${springMap.substring(1)}`,
          sizes,
          cache
        )
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
  const cache = new Map<string, number>()
  return input
    .map(({ springMap, sizes }) => {
      const c = getNumberOfCombinationsCached(
        new Array(5).fill(springMap).join('?'),
        [...sizes, ...sizes, ...sizes, ...sizes, ...sizes],
        cache
      )
      return c
    })
    .reduce((acc, size) => {
      return acc + size
    }, 0)
}
