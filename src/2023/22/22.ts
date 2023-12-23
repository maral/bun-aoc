import { PriorityQueue } from 'js-sdsl'

type BrickEdge = {
  x: number
  y: number
  z: number
}

type Brick = {
  from: BrickEdge
  to: BrickEdge
  topCollisions: Brick[]
  bottomCollisions: Brick[]
}

type Layers = Map<number, Brick[]>

export function parse(input: string): Brick[] {
  return input
    .split('\n')
    .map(deserializeBrick)
    .sort((a, b) => a.from.z - b.from.z)
}
function getEdge(brickEdge: string) {
  const [x, y, z] = brickEdge.split(',').map(n => parseInt(n, 10))
  return { x: x!, y: y!, z: z! }
}

export function partOne(bricks: ReturnType<typeof parse>) {
  const fallenBricks = fallDown(bricks)
  let count = 0
  for (const brick of fallenBricks) {
    if (brick.topCollisions.every(other => other.bottomCollisions.length > 1)) {
      count++
    }
  }

  return count
}

export function partTwo(bricks: ReturnType<typeof parse>) {
  return fallDown(bricks).reduce((acc, brick) => {
    const count = countFallingBricks(brick)
    return count + acc
  }, 0)
}

function countFallingBricks(brick: Brick): number {
  const disintegrated = new Set<string>()
  const inQueue = new Set<string>()
  disintegrated.add(serializeBrick(brick))
  const queue = new PriorityQueue<Brick>(brick.topCollisions, (a, b) => {
    return a.from.z - b.from.z
  })
  while (queue.length > 0) {
    const brick = queue.pop()!
    if (
      brick.bottomCollisions.every(other =>
        disintegrated.has(serializeBrick(other))
      )
    ) {
      disintegrated.add(serializeBrick(brick))
    }
    brick.topCollisions.forEach(other => {
      if (!inQueue.has(serializeBrick(other))) {
        queue.push(other)
        inQueue.add(serializeBrick(other))
      }
    })
  }
  // subtract the brick itself
  return disintegrated.size - 1
}

function fallDown(bricks: Brick[]) {
  const layers = new Map<number, Brick[]>()
  layers.set(1, [])
  let highestLayer = 1
  bricks.forEach(brick => {
    let layer = Math.min(highestLayer, brick.from.z - 1)
    while (layer > 0) {
      if (!layers.has(layer)) {
        layer--
        continue
      }
      if (collidesWithLayer(brick, layers.get(layer)!)) {
        highestLayer = addToLayer(layers, layer + 1, brick, highestLayer)
        return
      }
      layer--
    }
    highestLayer = addToLayer(layers, 1, brick, highestLayer)
  })
  const result: Brick[] = []
  for (const [layer, bricks] of layers.entries()) {
    result.push(...bricks.filter(brick => brick.from.z === layer))
  }
  return result
}

function collidesWithLayer(brick: Brick, layer: Brick[]) {
  let collision = false
  for (const other of layer) {
    if (collidesInPlane(brick, other)) {
      collision = true
      brick.bottomCollisions.push(other)
      other.topCollisions.push(brick)
    }
  }
  return collision
}

export function collidesInPlane(brick: Brick, other: Brick) {
  return (
    (between(brick, other, 'x') || between(other, brick, 'x')) &&
    (between(brick, other, 'y') || between(other, brick, 'y'))
  )
}

function between(brick: Brick, other: Brick, axis: 'x' | 'y') {
  const otherFrom =
    other.from[axis] <= other.to[axis] ? other.from[axis] : other.to[axis]
  const otherTo =
    other.from[axis] >= other.to[axis] ? other.from[axis] : other.to[axis]
  return (
    (brick.from[axis] >= otherFrom && brick.from[axis] <= otherTo) ||
    (brick.to[axis] >= otherFrom && brick.to[axis] <= otherTo)
  )
}

export function deserializeBrick(brick: string): Brick {
  const [fromEdge, toEdge] = brick.split('~')
  const from = getEdge(fromEdge!)
  const to = getEdge(toEdge!)

  // flip so that from.z is less than or equal to.z
  return {
    from: to.z < from.z ? to : from,
    to: to.z < from.z ? from : to,
    topCollisions: [],
    bottomCollisions: []
  }
}

function serializeBrick(brick: Brick) {
  return `${brick.from.x},${brick.from.y},${brick.from.z}~${brick.to.x},${brick.to.y},${brick.to.z}`
}

function addToLayer(
  layers: Layers,
  layer: number,
  brick: Brick,
  highestLayer: number
): number {
  const height = brick.to.z - brick.from.z
  brick.from.z = layer
  brick.to.z = layer + height
  const layerBricks = layers.get(layer) || []
  layerBricks.push(brick)
  layers.set(layer, layerBricks)

  if (height > 0) {
    layer = layer + height
    const layerBricks = layers.get(layer) || []
    layerBricks.push(brick)
    layers.set(layer, layerBricks)
  }

  return Math.max(layer, highestLayer)
}
