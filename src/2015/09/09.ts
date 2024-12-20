import { parseNumbersGrid } from '../../utils'

type Input = ReturnType<typeof parse>
type Graph = Map<string, Map<string, number>>

export function parse(input: string) {
  const regex = /^(\w+) to (\w+) = (\d+)$/gm
  return Array.from(input.matchAll(regex), ([, from, to, distance]) => ({
    from,
    to,
    distance: Number(distance)
  }))
}

export function partOne(input: Input) {
  const graph = buildGraph(input)
  return Math.min(
    ...graph.keys().map(city => findExtremePath(city, graph, 'min'))
  )
}

export function partTwo(input: Input) {
  const graph = buildGraph(input)
  return Math.max(
    ...graph.keys().map(city => findExtremePath(city, graph, 'max'))
  )
}

function buildGraph(input: Input) {
  const graph = new Map<string, Map<string, number>>()

  for (const { from, to, distance } of input) {
    const first = graph.get(from) ?? new Map<string, number>()
    first.set(to, distance)
    const second = graph.get(to) ?? new Map<string, number>()
    second.set(from, distance)
    graph.set(from, first)
    graph.set(to, second)
  }
  return graph
}

function findExtremePath(
  at: string,
  graph: Graph,
  extreme: 'min' | 'max',
  visited?: Set<string>
) {
  if (visited && visited.size === graph.size - 1) {
    return 0
  }

  let currentExtreme = extreme === 'min' ? Infinity : 0
  for (const city of graph.keys()) {
    if ((visited && visited.has(city)) || city === at) {
      continue
    }

    const d = graph.get(at)!.get(city)!
    const v = new Set<string>(visited)
    v.add(at)
    currentExtreme = (extreme === 'min' ? Math.min : Math.max)(
      currentExtreme,
      d + findExtremePath(city, graph, extreme, v)
    )
  }
  return currentExtreme
}
