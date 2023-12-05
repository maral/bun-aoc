type Parsed = {
  seeds: number[]
  maps: {
    from: string
    to: string
    convertMap: { from: number; to: number; targetOffset: number }[]
  }[]
}

export function parse(input: string): Parsed {
  const [seeds, ...maps] = input.split('\n\n')
  return {
    seeds: seeds!.match(/\d+/g)!.map(Number),
    maps: maps.map(map => {
      const [first, ...convertMap] = map.split('\n')
      const [from, to] = first!.split('-to-')
      return {
        from: from!,
        to: to!.split(' ')[0]!,
        convertMap: convertMap.map(line => {
          const [target, source, size] = line.split(' ').map(Number)
          return {
            from: source!,
            to: source! + size! - 1,
            targetOffset: target!
          }
        })
      }
    })
  }
}

const startCategory = 'seed'
const goalCategory = 'location'

function getMinLocation(seeds: number[], maps: Parsed['maps']) {
  return Math.min(
    ...seeds.map(seed => {
      let currentCategory = startCategory

      while (currentCategory !== goalCategory) {
        const map = maps.find(category => category.from === currentCategory)!
        const convertMap = map.convertMap.find(
          ({ from, to }) => seed >= from && seed <= to
        )!
        seed = convertMap
          ? convertMap.targetOffset + seed - convertMap.from
          : seed
        currentCategory = map.to
      }

      return seed
    })
  )
}

export function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function partOne(input: ReturnType<typeof parse>) {
  return getMinLocation(input.seeds, input.maps)
}

export function partTwo(input: ReturnType<typeof parse>) {
  let currentRanges: { from: number; to: number }[] = []
  let prevRanges: { from: number; to: number }[] = []
  for (let i = 0; i < input.seeds.length; i += 2) {
    currentRanges.push({
      from: input.seeds[i]!,
      to: input.seeds[i]! + input.seeds[i + 1]! - 1
    })
  }

  let currentCategory = startCategory
  while (currentCategory !== goalCategory) {
    const map = input.maps.find(category => category.from === currentCategory)!
    const convertMap = map.convertMap
    prevRanges = currentRanges
    currentRanges = []
    for (const range of prevRanges) {
      let start = range.from
      while (start < range.to) {
        const destination = convertMap.find(({ from, to }) => start >= from && start <= to)
        if (destination) {
          const { targetOffset, from, to } = destination
          const end = Math.min(to, range.to)
          currentRanges.push({
            from: targetOffset + start - from,
            to: targetOffset + end - from
          })
          start = end + 1
        } else {
          const intersecting = convertMap.filter(({ from }) => start < from && from <= range.to)
          if (intersecting.length > 0) {
            intersecting.sort((a, b) => a.from - b.from)
            currentRanges.push({
              from: start,
              to: intersecting[0]!.from - 1
            })
            start = intersecting[0]!.from
          } else {
            currentRanges.push({
              from: start,
              to: range.to
            })
            start = range.to + 1
          }
        }
      }
    }
    currentCategory = map.to
  }

  return Math.min(...currentRanges.map(({ from }) => from))
}
