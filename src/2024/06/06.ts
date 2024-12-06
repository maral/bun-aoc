export function parse(input: string) {
  return input.split('\n').map(line => line.split(''))
}

let directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
]

export function partOne(input: ReturnType<typeof parse>) {
  walkOver(input)
  return input.reduce(
    (sum, row) =>
      sum + row.reduce((sumRow, col) => sumRow + (col === 'X' ? 1 : 0), 0),
    0
  )
}

function walkOver(input: ReturnType<typeof parse>) {
  const position = findStart(input)
  let direction = 0
  while (true) {
    input[position[1]][position[0]] = 'X'
    const next =
      input[position[1] + directions[direction][1]]?.[
        position[0] + directions[direction][0]
      ] ?? null
    if (next === null) {
      break
    }
    if (next === '#') {
      direction++
      direction = direction % 4
      continue
    }
    position[0] += directions[direction][0]
    position[1] += directions[direction][1]
  }
}

export function partTwo(input: ReturnType<typeof parse>) {
  let sum = 0
  const start = findStart(input)
  walkOver(input)

  for (let [y, row] of input.entries()) {
    for (let [x, char] of row.entries()) {
      if (char === 'X') {
        input[y][x] = '#'
        if (isLoop(input, start)) {
          sum++
        }
        input[y][x] = '.'
      }
    }
  }
  return sum
}

function isLoop(input: ReturnType<typeof parse>, start: [number, number]) {
  let position = [start[0], start[1]] as [number, number]
  let direction = 0
  const visited = new Set<string>()
  while (true) {
    const visitHash = getVisitHash(position, direction)
    if (visited.has(visitHash)) {
      return true
    }
    visited.add(visitHash)
    const next =
      input[position[1] + directions[direction][1]]?.[
        position[0] + directions[direction][0]
      ] ?? null
    if (next === null) {
      return false
    }
    if (next === '#') {
      direction++
      direction = direction % 4
      continue
    }
    position[0] += directions[direction][0]
    position[1] += directions[direction][1]
  }
}

function findStart(input: ReturnType<typeof parse>): [number, number] {
  for (let [y, row] of input.entries()) {
    for (let [x, char] of row.entries()) {
      if (char === '^') {
        return [x, y]
      }
    }
  }
  return [0, 0]
}

function getVisitHash([x, y]: [number, number], direction: number) {
  return `${x}.${y}:${direction}`
}
