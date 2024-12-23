type Input = ReturnType<typeof parse>

export function parse(input: string) {
  const graph = new Map<string, Set<string>>()
  for (const [a, b] of input.split('\n').map(line => line.split('-'))) {
    const ga = graph.get(a) ?? graph.set(a, new Set<string>()).get(a)!
    ga.add(b)
    const gb = graph.get(b) ?? graph.set(b, new Set<string>()).get(b)!
    gb.add(a)
  }
  return graph
}

export function partOne(input: Input) {
  let count = 0
  for (const [node, connections] of input.entries()) {
    const filtered = Array.from(connections).filter(conn => node < conn)
    for (const b of filtered) {
      for (const c of filtered) {
        if (b < c && input.get(b)!.has(c)) {
          if (node.startsWith('t') || b.startsWith('t') || c.startsWith('t')) {
            count++
          }
        }
      }
    }
  }
  return count
}

export function partTwo(input: Input) {
  let max = 0
  let maxPassword = ''
  for (const [node, connections] of input.entries()) {
    const subgraph = findLargestFullGraph(
      input,
      [node],
      Array.from(connections),
      0
    )

    if (subgraph.length > max) {
      subgraph.sort()
      max = subgraph.length
      maxPassword = subgraph.join(',')
    }
  }
  return maxPassword
}

function findLargestFullGraph(
  graph: Input,
  inSet: string[],
  all: string[],
  index: number
): string[] {
  if (index >= all.length) {
    return inSet
  }

  const next = all[index]
  const nextNode = graph.get(next)!
  const set1 = findLargestFullGraph(graph, inSet, all, index + 1)
  if (inSet.every(a => nextNode.has(a))) {
    const set2 = findLargestFullGraph(graph, [...inSet, next], all, index + 1)
    return set1.length > set2.length ? set1 : set2
  }
  return set1
}
