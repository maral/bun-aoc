type Graph = Record<string, string[]>

export function parse(input: string) {
  const graph: Graph = {}
  input.split('\n').map(line => {
    const [first, rest] = line.split(': ')
    rest!.split(' ').forEach(part => {
      const firstEdges = graph[first!] || []
      const otherEdges = graph[part] || []
      graph[part] = [...otherEdges, first!]
      graph[first!] = [...firstEdges, part]
    })
  })
  return graph
}

function printGraphVizInput(input: ReturnType<typeof parse>) {
  console.log('graph {')
  Object.entries(input).forEach(([key, value]) => {
    console.log(`  ${key} -- { ${value.join(' ')} };`)
  })
  console.log('}')
}

const toRemove: [string, string][] = [
  ['dlk', 'pjj'],
  ['htj', 'pcc'],
  ['bbg', 'htb']
]

export function partOne(input: ReturnType<typeof parse>) {
  toRemove.forEach(edge => removeEdge(input, edge))

  return getClusterSize(input, 'dlk') * getClusterSize(input, 'pjj')
}

function removeEdge(graph: Graph, edge: [string, string]) {
  const [a, b] = edge
  graph[a] = graph[a]!.filter(x => x !== b)
  graph[b] = graph[b]!.filter(x => x !== a)
}

function getClusterSize(graph: Graph, start: string) {
  const seen = new Set<string>()
  const queue = [start]
  while (queue.length > 0) {
    const current = queue.shift()!
    if (seen.has(current)) continue
    seen.add(current)
    queue.push(...graph[current]!)
  }
  return seen.size
}

export function partTwo(input: ReturnType<typeof parse>) {}
