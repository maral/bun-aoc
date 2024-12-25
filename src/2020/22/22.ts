import { Queue, Deque } from 'js-sdsl'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n\n').map(p =>
    p
      .split('\n')
      .slice(1)
      .map(line => parseInt(line))
  )
}

export function partOne(input: Input) {
  const a = new Queue(input[0])
  const b = new Queue(input[1])

  while (!a.empty() && !b.empty()) {
    const ca = a.pop()!
    const cb = b.pop()!
    const winner = ca > cb ? a : b
    winner.push(ca > cb ? ca : cb)
    winner.push(ca > cb ? cb : ca)
  }
  const winner = a.empty() ? b : a
  let total = 0
  while (!winner.empty()) {
    total += winner.size() * winner.pop()!
  }
  return total
}

export function partTwo(input: Input) {
  const a = new Deque(input[0])
  const b = new Deque(input[1])
  const cache = new Map<string, boolean>()
  const winner = recursiveRoundWinner(a, b, cache) ? a : b
  let total = 0
  while (!winner.empty()) {
    total += winner.size() * winner.popFront()!
  }
  return total
}

function recursiveRoundWinner(
  a: Deque<number>,
  b: Deque<number>,
  cache: Map<string, boolean>,
  level = 0
) {
  const gameKey = getHandsKey(a, b)
  if (cache.has(gameKey)) {
    return cache.get(gameKey)!
  }

  const playedHands = new Set<string>()

  while (!a.empty() && !b.empty()) {
    const key = getHandsKey(a, b)
    if (playedHands.has(key)) {
      b.clear()
      break
    }
    playedHands.add(key)

    const ca = a.popFront()!
    const cb = b.popFront()!
    let firstWon = ca > cb
    if (ca <= a.size() && cb <= b.size()) {
      firstWon = recursiveRoundWinner(
        new Deque(Array.from(a).slice(0, ca)),
        new Deque(Array.from(b).slice(0, cb)),
        cache,
        level + 1
      )
    }
    const winner = firstWon ? a : b
    winner.pushBack(firstWon ? ca : cb)
    winner.pushBack(firstWon ? cb : ca)
  }
  cache.set(gameKey, b.empty())
  return b.empty()
}

function getHandsKey(a: Deque<number>, b: Deque<number>) {
  return `${Array.from(a).join(',')}:${Array.from(b).join(',')}`
}
