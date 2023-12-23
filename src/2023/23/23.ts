import { Queue } from 'js-sdsl'

type Vertex = {
  x: number
  y: number
}

type Direction = 'up' | 'down' | 'left' | 'right'

const directions: Direction[] = ['up', 'down', 'left', 'right']

const opposites: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
}

type Field = '.' | '#' | '<' | '>' | 'v' | '^'

const fieldDirections: Record<Field, Direction[]> = {
  '.': ['up', 'down', 'left', 'right'],
  '#': [],
  '<': ['left'],
  '>': ['right'],
  v: ['down'],
  '^': ['up']
}

const offsets: Record<Direction, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0]
}

type FieldState = {
  vertex: Vertex
  direction: Direction
  length: number
  previous: Vertex
}

type Graph = {
  edges: Map<number, [number, number][]>
  vertexMap: Map<string, number>
}

export function parse(input: string) {
  return input.split('\n')
}

export function partOne(map: ReturnType<typeof parse>) {
  const graph = getGraph(map)
  const start = getVertexNumber(getVertexKey(getStart()), graph.vertexMap)
  const goal = getVertexNumber(getVertexKey(getGoal(map)), graph.vertexMap)
  return findLongestPath(graph, start, goal)
}

export function partTwo(map: ReturnType<typeof parse>) {
  const graph = getGraph(map, true)
  const start = getVertexNumber(getVertexKey(getStart()), graph.vertexMap)
  const goal = getVertexNumber(getVertexKey(getGoal(map)), graph.vertexMap)
  const result = findLongestPath(graph, start, goal)
  return result
}

function getStart(): Vertex {
  return { x: 1, y: 0 }
}

function getGoal(map: ReturnType<typeof parse>): Vertex {
  return { x: map[0]!.length - 2, y: map.length - 1 }
}

function findLongestPath(
  graph: Graph,
  from: number,
  goal: number,
  visited: bigint = setBit(0n, from),
  traveled = 0,
  cache = new Map<bigint, [number, number | null]>()
): number | null {
  if (cache.has(visited)) {
    const cached = cache.get(visited)!
    if (cached[0] >= traveled) {
      return cached[1]
    }
  }
  const edges = graph.edges.get(from) || []
  const paths = edges
    .map(([to, length]) => {
      if (isBitSet(visited, to)) {
        return null
      }
      if (to === goal) {
        return length + traveled
      }
      return findLongestPath(
        graph,
        to,
        goal,
        setBit(visited, to),
        traveled + length,
        cache
      )
    })
    .filter(path => path !== null) as number[]

  const result = paths.length > 0 ? Math.max(...paths) : null
  cache.set(visited, [traveled, result])
  return result
}

function setBit(value: bigint, bit: number) {
  return value | (1n << BigInt(bit))
}

function isBitSet(value: bigint, bit: number) {
  return (value & (1n << BigInt(bit))) !== 0n
}

export function getGraph(map: ReturnType<typeof parse>, twoWay = false) {
  const vertices = new Set<string>()
  const edges = new Map<string, [string, number][]>()
  const queue = new Queue<FieldState>()
  queue.push({
    direction: 'down',
    length: 0,
    previous: { x: 1, y: 0 },
    vertex: { x: 1, y: 0 }
  })

  while (queue.size() > 0) {
    const fieldState = queue.pop()!
    let length = fieldState.length
    let previous = fieldState.previous
    const possibleDirections = directions.filter(direction => {
      const field = getField(map, fieldState.vertex, offsets[direction])
      return (
        direction !== opposites[fieldState.direction] &&
        (twoWay ? field !== '#' : fieldDirections[field].includes(direction))
      )
    })

    if (
      possibleDirections.length > 1 ||
      (fieldState.vertex.x === map[0]!.length - 2 &&
        fieldState.vertex.y === map.length - 1)
    ) {
      addEdge(edges, fieldState.previous, fieldState.vertex, fieldState.length)
      if (twoWay) {
        addEdge(
          edges,
          fieldState.vertex,
          fieldState.previous,
          fieldState.length
        )
      }
      if (vertices.has(getVertexKey(fieldState.vertex))) {
        continue
      }
      vertices.add(getVertexKey(fieldState.vertex))

      length = 0
      previous = fieldState.vertex
    }

    possibleDirections.forEach(direction => {
      queue.push({
        direction: direction,
        length: length + 1,
        previous: previous,
        vertex: {
          x: fieldState.vertex.x + offsets[direction][0],
          y: fieldState.vertex.y + offsets[direction][1]
        }
      })
    })
  }

  return renameGraph(vertices, edges)
}

function renameGraph(
  vertices: Set<string>,
  edges: Map<string, [string, number][]>
): Graph {
  const vertexMap = new Map<string, number>()
  const newEdges = new Map<number, [number, number][]>()
  Array.from(edges.keys()).forEach(vertex => {
    const list = edges.get(vertex) || []
    newEdges.set(
      getVertexNumber(vertex, vertexMap),
      list.map(([to, length]) => [getVertexNumber(to, vertexMap), length])
    )
  })

  return { edges: newEdges, vertexMap }
}

function addEdge(
  edges: Map<string, [string, number][]>,
  from: Vertex,
  to: Vertex,
  length: number
) {
  const fromEdges = edges.get(getVertexKey(from)) || []
  const existingIndex = fromEdges.findIndex(
    ([vertex]) => vertex === getVertexKey(to)
  )
  if (existingIndex === -1) {
    fromEdges.push([getVertexKey(to), length])
  } else {
    fromEdges[existingIndex]![1] = Math.max(
      fromEdges[existingIndex]![1],
      length
    )
  }
  edges.set(getVertexKey(from), fromEdges)
}

function getField(
  map: ReturnType<typeof parse>,
  vertex: Vertex,
  offset: [number, number]
): Field {
  const x = vertex.x + offset[0]
  const y = vertex.y + offset[1]
  if (y < 0 || y >= map.length || x < 0 || x >= map[y]!.length) {
    return '#'
  } else {
    return map[y]![x] as Field
  }
}

function getVertexKey(vertex: Vertex) {
  return `${vertex.x},${vertex.y}`
}

function getVertexNumber(vertex: string, vertexMap: Map<string, number>) {
  if (!vertexMap.has(vertex)) {
    vertexMap.set(vertex, vertexMap.size)
  }
  return vertexMap.get(vertex)!
}
