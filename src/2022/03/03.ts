export function parse(input: string) {
  return input.split('\n')
}

export function partOne(input: ReturnType<typeof parse>) {
  const compartmented = input.map(line => {
    return [
      line.substring(0, line.length / 2),
      line.substring(line.length / 2, line.length)
    ] as [string, string]
  })

  return compartmented
    .map(([first, second]) =>
      itemPriority(first.split('').find(char => second.includes(char))!)
    )
    .reduce((a, b) => a + b)
}

export function partTwo(input: ReturnType<typeof parse>) {
  let sum = 0
  for (let i = 0; i < input.length; i += 3) {
    sum += itemPriority(input[i]!.split('').find(
      char => input[i + 1]!.includes(char) && input[i + 2]!.includes(char)
    )!)
  }
  return sum
}

function itemPriority(char: string) {
  return char.charCodeAt(0) <= 90
    ? char.charCodeAt(0) - 38
    : char.charCodeAt(0) - 96
}
