export function parse(input: string) {
  return input
}

export function partOne(input: ReturnType<typeof parse>) {
  const regex = /mul\((\d+),(\d+)\)/g
  let sum = 0

  input.match(regex)?.forEach(match => {
    const [a, b] = match.substring(4, match.length - 1).split(',')
    sum += parseInt(a) * parseInt(b)
  })
  return sum
}

export function partTwo(input: ReturnType<typeof parse>) {
  const regex = /mul\(\d+,\d+\)|do\(\)|don't\(\)/g

  let sum = 0
  let enabled = true
  input.match(regex)?.forEach(match => {
    if (match === 'do()') {
      enabled = true
    } else if (match === "don't()") {
      enabled = false
    } else if (enabled) {
      const [a, b] = match.substring(4, match.length - 1).split(',')
      sum += parseInt(a) * parseInt(b)
    }
  })
  return sum
}
