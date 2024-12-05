export function parse(input: string) {
  const [o, lines] = input.split('\n\n')
  const ordering = o
    .split('\n')
    .map(line => line.split('|').map(n => parseInt(n)))
    .reduce((prev, [a, b]) => {
      if (prev.has(a)) {
        prev.get(a)!.push(b)
      } else {
        prev.set(a, [b])
      }
      return prev
    }, new Map<number, number[]>())
  return [
    ordering,
    lines.split('\n').map(line => line.split(',').map(n => parseInt(n)))
  ] as [Map<number, number[]>, number[][]]
}

export function partOne([ordering, lines]: ReturnType<typeof parse>) {
  let sum = 0
  for (const line of lines) {
    if (
      line.every((n, i) => {
        return (
          !ordering.has(n) ||
          !ordering.get(n)!.some(a => line.slice(0, i).includes(a))
        )
      })
    ) {
      sum += line[Math.round((line.length - 1) / 2)]
    }
  }
  return sum
}

export function partTwo([ordering, lines]: ReturnType<typeof parse>) {
  let sum = 0
  for (let line of lines) {
    let isCorrect = true
    for (let i = 0; i < line.length; i++) {
      if (!ordering.has(line[i])) {
        continue
      }

      const order = ordering.get(line[i])!
      for (const a of order) {
        if (line.slice(0, i).includes(a)) {
          isCorrect = false
          line.splice(line.indexOf(a), 1)
          line.splice(i, 0, a)
          i -= 1
        }
      }
    }
    if (!isCorrect) {
      sum += line[Math.round((line.length - 1) / 2)]
    }
  }
  return sum
}
