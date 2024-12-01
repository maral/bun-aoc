export function parse(input: string) {
  const list = input
    .split('\n')
    .map(line => line.split('   ').map(n => parseInt(n)) as [number, number])
  const first = []
  const second = []
  for (const [a, b] of list) {
    first.push(a)
    second.push(b)
  }
  return [first, second]
}

export function partOne([first, second]: ReturnType<typeof parse>) {
  let sum = 0
  for (const [index, value] of first.entries()) {
    sum += Math.abs(value - second[index])
  }

  return sum
}

export function partTwo([first, second]: ReturnType<typeof parse>) {
  let sum = 0
  for (const value of first) {
    sum += second.filter(b => b === value).length * value
  }
  return sum
}
