export function parse(input: string) {
  return input.split('\n').map(line => line.split(' ').map(n => parseInt(n)))
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.filter(isLineValid).length
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.filter(isLineValidTwo).length
}

function isLineValid(line: number[]) {
  const diffs = line.map((value, index) =>
    index > 0 ? value - line[index - 1] : null
  )
  return (
    diffs.every(diff => diff === null || (diff >= 1 && diff <= 3)) ||
    diffs.every(diff => diff === null || (diff <= -1 && diff >= -3))
  )
}

function isLineValidTwo(line: number[]) {
  if (isLineValid(line)) {
    return true
  }

  for (const [index, _] of line.entries()) {
    if (isLineValid(line.filter((__, i) => i !== index))) {
      return true
    }
  }
  return false
}
