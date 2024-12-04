import range from 'lodash.range'

export function parse(input: string) {
  return input.split('\n').map(line => line.split(''))
}

export function partOne(input: ReturnType<typeof parse>) {
  let sum = 0

  // inspired by https://www.reddit.com/r/adventofcode/comments/1h689qf/comment/m0bpsvn/
  // my original solution below in `partOneOld` function
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input.length; x++) {
      for (const dx of [-1, 0, 1]) {
        for (const dy of [-1, 0, 1]) {
          sum += range(4)
            .map(
              n =>
                y + dy * n >= 0 &&
                y + dy * n < input.length &&
                (input[y + dy * n][x + dx * n] ?? '') === 'XMAS'[n]
            )
            .every(b => b)
            ? 1
            : 0
        }
      }
    }
  }
  return sum
}

export function partTwo(input: ReturnType<typeof parse>) {
  let sum = 0
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      sum += isSquareXmas(input, j, i) ? 1 : 0
    }
  }
  return sum
}

function isSquareXmas(input: string[][], x: number, y: number) {
  if (x > input[y].length - 3 || y > input.length - 3) {
    return false
  }
  if (input[y + 1][x + 1] !== 'A') {
    return false
  }
  const rest =
    input[y][x] + input[y][x + 2] + input[y + 2][x] + input[y + 2][x + 2]
  return /MSMS|SSMM|SMSM|MMSS/.test(rest)
}

function partOneOld(input: ReturnType<typeof parse>) {
  let sum = 0
  for (let i = 0; i < input.length; i++) {
    sum += countInstances(input[i])

    if (i > 0) {
      sum += countInstances(
        input
          .map((_, j) => (i + j < input.length ? input[i + j][j] : null))
          .filter(n => n !== null)
      )
      sum += countInstances(
        input
          .map((_, j) =>
            input.length - 1 + i - j < input.length &&
            input.length - 1 + i - j >= 0
              ? input[input.length - 1 + i - j][j]
              : null
          )
          .filter(n => n !== null)
      )
    }
  }
  for (let i = 0; i < input[0].length; i++) {
    sum += countInstances(input.map(line => line[i]))
    sum += countInstances(
      input.map((_, j) => input[j][i + j] ?? null).filter(n => n !== null)
    )
    sum += countInstances(
      input.map((_, j) => input[j][i - j] ?? null).filter(n => n !== null)
    )
  }

  return sum
}
function countInstances(line: string[]) {
  return (
    (line.join('').match(/XMAS/g) || []).length +
    (line.join('').match(/SAMX/g) || []).length
  )
}
