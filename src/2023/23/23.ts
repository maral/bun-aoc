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
  vertices: Set<string>
  edges: Map<string, [string, number][]>
}

export function parse(input: string) {
  return input.split('\n')
}

export function partOne(map: ReturnType<typeof parse>) {
  const graph = getGraph(map)
  // console.log(graph.edges)
  // console.log(graph.vertices.size, graph.edges.size)
  const start = getVertexKey(getStart())
  const goal = getVertexKey(getGoal(map))
  return findLongestPath(graph, start, goal)
}

export function partTwo(map: ReturnType<typeof parse>) {
  const graph = getGraph(map, true)
  const start = getVertexKey(getStart())
  const goal = getVertexKey(getGoal(map))

  return findLongestPath(graph, start, goal)
}

function getStart(): Vertex {
  return { x: 1, y: 0 }
}

function getGoal(map: ReturnType<typeof parse>): Vertex {
  return { x: map[0]!.length - 2, y: map.length - 1 }
}

function findLongestPath(
  graph: Graph,
  from: string,
  goal: string,
  visited: Set<string> = new Set([from]),
  traveled = 0
): number | null {
  const edges = graph.edges.get(from) || []
  const paths = edges
    .map(([to, length]) => {
      if (visited.has(to)) {
        return null
      }
      if (to === goal) {
        return length + traveled
      }
      const newVisited = new Set(visited)
      newVisited.add(to)
      return findLongestPath(graph, to, goal, newVisited, traveled + length)
    })
    .filter(path => path !== null) as number[]

  return paths.length > 0 ? Math.max(...paths) : null
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

  return { vertices, edges }
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

function getEdgeKey(from: string, to: string, visited: Set<string>) {
  return [from, to].sort().join(';') + '-' + [...visited].sort().join(';')
}
