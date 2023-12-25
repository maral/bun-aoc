export function parse(input: string) {
  return input.split('\n\n').map(line => line.split('\n').map(Number))
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce(
    (acc, group) =>
      Math.max(
        group.reduce((acc, calories) => acc + calories, 0),
        acc
      ),
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input
    .map(group => group.reduce((acc, calories) => acc + calories, 0))
    .sort((a, b) => a - b)
    .slice(-3)
    .reduce((acc, calories) => acc + calories, 0)
}
