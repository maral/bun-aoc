type Direction = 'north' | 'south' | 'east' | 'west'

export function parse(input: string) {
  return input.split('\n').map(line => line.split(''))
}

export function partOne(input: ReturnType<typeof parse>) {
  return getNorthSupportTotalLoad(tilt(input, 'north'))
}

const limit = 1000000000

export function partTwo(input: ReturnType<typeof parse>) {
  const cache = new Map<number, number>()
  let cycles = 0
  let isEnd = false
  while (cycles < limit) {
    tilt(input, 'north')
    tilt(input, 'west')
    tilt(input, 'south')
    tilt(input, 'east')

    cycles++

    if (!isEnd) {
      const key = fnv1aHash(input)
      if (cache.has(key)) {
        const cycleLength = cycles - cache.get(key)!
        const remainder = (limit - cycles) % cycleLength
        cycles = limit - remainder
        isEnd = true
      } else {
        cache.set(key, cycles)
      }
    }
  }
  return getNorthSupportTotalLoad(input)
}

function getNorthSupportTotalLoad(input: ReturnType<typeof parse>) {
  return input.reduce((acc, row, index) => {
    return (
      acc + row.filter(cell => cell === 'O').length * (input.length - index)
    )
  }, 0)
}

export function tilt(input: ReturnType<typeof parse>, direction: Direction) {
  const otherSize = isVertical(direction) ? input[0]!.length : input.length
  const tiltDirectionSize = isVertical(direction)
    ? input.length
    : input[0]!.length

  for (let i = 0; i < otherSize; i++) {
    let freeIndex = -1
    for (let j = 0; j < tiltDirectionSize; j++) {
      const row = isVertical(direction)
        ? isReversed(direction)
          ? tiltDirectionSize - j - 1
          : j
        : i
      const column = isVertical(direction)
        ? i
        : isReversed(direction)
          ? tiltDirectionSize - j - 1
          : j
      switch (input[row]![column]!) {
        case 'O':
          if (freeIndex !== -1) {
            if (isVertical(direction)) {
              input[freeIndex]![column] = 'O'
              input[row]![column] = '.'
            } else {
              input[row]![freeIndex] = 'O'
              input[row]![column] = '.'
            }
            freeIndex += isReversed(direction) ? -1 : 1
          }
          break
        case '.':
          if (freeIndex === -1) {
            freeIndex = isVertical(direction) ? row : column
          }
          break
        case '#':
          freeIndex = -1
          break
      }
    }
  }
  return input
}

function isVertical(direction: Direction) {
  return direction === 'north' || direction === 'south'
}

function isReversed(direction: Direction) {
  return direction === 'south' || direction === 'east'
}

export function fnv1aHash(input: ReturnType<typeof parse>) {
  let hash = 0x811c9dc5
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input.length; x++) {
      hash ^= input[y]![x]!.charCodeAt(0)
      hash +=
        (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
    }
  }
  return hash >>> 0
}
