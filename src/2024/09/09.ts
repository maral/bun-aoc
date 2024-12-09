import range from 'lodash.range'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('').map(n => parseInt(n))
}

export function partOne(input: Input) {
  const result = getResultArray(input)

  let frontIndex = 0
  let backIndex = result.length - 1
  while (frontIndex < backIndex) {
    if (result[frontIndex] === '.') {
      result[frontIndex] = result[backIndex]
      result[backIndex] = '.'
      backIndex--
    } else {
      frontIndex++
    }
  }
  return (result.filter(n => n !== '.') as number[]).reduce(
    (sum, value, index) => sum + value * index,
    0
  )
}

export function partTwo(input: Input) {
  const result = []
  const lengths: [number, number][] = []
  const spaces: [number, number][] = []
  for (const [index, digit] of input.entries()) {
    if (index % 2 === 0) {
      lengths.push([digit, result.length])
    } else {
      spaces.push([digit, result.length])
    }
    for (const i of range(digit)) {
      result.push(index % 2 === 0 ? index / 2 : '.')
    }
  }

  for (let fileId = lengths.length - 1; fileId >= 0; fileId--) {
    const [len, position] = lengths[fileId]
    for (const [j, [space, spacePosition]] of spaces.entries()) {
      if (spacePosition > position) {
        break
      }
      if (space >= len) {
        for (const k of range(len)) {
          result[spacePosition + k] = fileId
          result[position + k] = '.'
        }
        spaces[j][0] -= len
        spaces[j][1] += len
        break
      }
    }
  }

  return result.reduce(
    (sum, value, index) =>
      value === '.' ? sum : (sum as number) + (value as number) * index,
    0
  )
}

function getResultArray(input: Input) {
  const result = []
  for (const [index, digit] of input.entries()) {
    for (const i of range(digit)) {
      result.push(index % 2 === 0 ? index / 2 : '.')
    }
  }
  return result
}
