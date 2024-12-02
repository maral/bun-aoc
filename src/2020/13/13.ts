import lcm from 'compute-lcm'

export function parse(input: string) {
  const lines = input.split('\n')
  return [parseInt(lines[0]), lines[1].split(',')] as [number, string[]]
}

export function partOne([timestamp, ids]: ReturnType<typeof parse>) {
  const times = ids.filter(id => id !== 'x').map(id => parseInt(id))
  let minWait = 10000000000
  let minId = 10000000000
  for (const n of times) {
    const waitTime = timestamp % n === 0 ? 0 : n - (timestamp % n)
    if (waitTime < minWait) {
      minWait = waitTime
      minId = n
    }
  }
  return minWait * minId
}

export function partTwo([_, ids]: ReturnType<typeof parse>) {
  const delays = ids
    .map((value, i) => (value === 'x' ? -1 : i))
    .filter(value => value !== -1)
  const times = ids.filter(id => id !== 'x').map(id => parseInt(id))
  const first = times[0]

  const sequences: { k: number; q: number; time: number }[] = []

  for (const [index, time] of times.entries()) {
    if (index === 0) {
      continue
    }

    const delay = delays[index]

    const m = lcm(first, time)
    const diffPoint = getDiffPoint(first, time, delay)
    sequences.push({ k: m!, q: diffPoint, time })
  }

  let { k, q } = sequences[0]
  for (const { k: k2, q: q2, time } of sequences.slice(1)) {
    const c = getFirstCoefficient(k, q, k2, q2)
    q += k * c
    k *= time
  }

  return q
}

function getDiffPoint(a: number, b: number, diff: number) {
  // find x, where x === k * b && x % a === delay
  let k = 0
  while (k < a * b) {
    if ((k * b) % a === diff % a) {
      return k * b - diff
    }
    k++
  }

  return 0
}

function getFirstCoefficient(k: number, q: number, k2: number, q2: number) {
  const upperBound = lcm(k, k2)
  let x = 0
  while (k * x < upperBound! * 10) {
    if ((k * x + q - q2) % k2 === 0) {
      return x
    }
    x++
  }
  return 0
}
