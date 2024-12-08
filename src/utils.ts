export function sum(numbers: number[]) {
  return numbers.reduce((total, n) => total + n, 0)
}

export function parseCharGrid(input: string) {
  return input.split('\n').map(line => line.split(''))
}

export function parseNumbersGrid(input: string, numberSeparator = ' ') {
  return input
    .split('\n')
    .map(line => line.split(numberSeparator).map(n => parseInt(n)))
}
