import { product } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('').map(i => parseInt(i))
}

export function partOne(input: Input) {
  const nodeMap = playGame(input, 9, 100)
  const afterOne = move(nodeMap.get(1)!, 1)
  return takeNext(afterOne, 8).join('')
}

type Node = {
  value: number
  prev?: Node
  next?: Node
}

export function partTwo(input: Input) {
  const nodeMap = playGame(input, 1_000_000, 10_000_000)
  const afterOne = move(nodeMap.get(1)!, 1)
  return product(takeNext(afterOne, 2))
}

function playGame(input: Input, circleSize: number, rounds: number) {
  const { start, nodeMap } = buildLinkList(input, circleSize)

  let current = start
  for (let i = 0; i < rounds; i++) {
    const pickedUpValues = takeNext(move(current, 1), 3)
    let destination = ((current.value + circleSize - 2) % circleSize) + 1
    while (pickedUpValues.includes(destination)) {
      destination = ((destination + circleSize - 2) % circleSize) + 1
    }
    const pickedUpStart = move(current, 1)
    const pickedUpEnd = move(current, 3)
    const destinationStart = nodeMap.get(destination)!
    const destinationEnd = move(destinationStart, 1)

    connect(current, move(current, 4))
    connect(destinationStart, pickedUpStart)
    connect(pickedUpEnd, destinationEnd)

    current = move(current, 1)
  }

  return nodeMap
}

function buildLinkList(input: Input, length: number) {
  const start: Node = {
    value: input[0]
  }
  const nodeMap = new Map<number, Node>()
  nodeMap.set(input[0], start)

  let prev = start

  for (let i = 1; i < length; i++) {
    const next: Node = {
      value: i < input.length ? input[i] : i + 1,
      prev
    }
    nodeMap.set(next.value, next)
    prev.next = next
    prev = next
  }
  prev.next = start
  start.prev = prev
  return { start, nodeMap }
}

function connect(a: Node, b: Node) {
  a.next = b
  b.prev = a
}

function move(node: Node, steps: number) {
  for (let i = 0; i < steps; i++) {
    node = node.next!
  }
  return node
}

function takeNext(node: Node, n: number) {
  const result: number[] = []
  for (let i = 0; i < n; i++) {
    result.push(node.value)
    node = node.next!
  }
  return result
}
