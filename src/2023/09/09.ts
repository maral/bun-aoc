export function parse(input: string) {
  return input.split('\n').map(line => line.split(' ').map(Number))
}

export function partOne(input: ReturnType<typeof parse>) {
  return sum(
    input.map(line =>
      getPredictionLevels(line).reduce(
        (sum, level) => sum + level[level.length - 1]!,
        0
      )
    )
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  return sum(
    input.map(line =>
      getPredictionLevels(line)
        .reverse()
        .reduce((sum, level) => level[0]! - sum, 0)
    )
  )
}

function getPredictionLevels(line: number[]) {
  const levels: number[][] = [line]
  let level = 0
  while (!levels[level]!.every(num => num === 0)) {
    const newLevel = []
    for (let i = 0; i < levels[level]!.length - 1; i++) {
      newLevel.push(levels[level]![i + 1]! - levels[level]![i]!)
    }
    levels.push(newLevel)
    level++
  }
  return levels
}

function sum(arr: number[]) {
  return arr.reduce((sum, num) => sum + num, 0)
}
