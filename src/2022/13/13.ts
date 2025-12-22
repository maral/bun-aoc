type Input = ReturnType<typeof parse>
type NumberList = (number | NumberList)[]
type NumberListItem = NumberList[0]

export function parse(input: string) {
  return input
    .split('\n\n')
    .map(
      pair =>
        pair.split('\n').map(line => JSON.parse(line)) as [
          NumberList,
          NumberList
        ]
    )
}

export function partOne(input: Input) {
  let sum = 0
  for (const [i, pair] of input.entries()) {
    if (getOrder(pair[0], pair[1]) < 0) {
      sum += i + 1
    }
  }
  return sum
}

export function partTwo(input: Input) {
  const firstDivider: NumberList = [[2]]
  const secondDivider: NumberList = [[6]]
  const allPackets = [...input.flat(), firstDivider, secondDivider].sort(
    getOrder
  )
  return (
    (allPackets.findIndex(p => p === firstDivider) + 1) *
    (allPackets.findIndex(p => p === secondDivider) + 1)
  )
}

function getOrder(first: NumberListItem, second: NumberListItem): number {
  const firstNumber = typeof first === 'number'
  const secondNumber = typeof second === 'number'
  if (firstNumber && secondNumber) {
    return Math.sign(first - second)
  }
  if (firstNumber && !secondNumber) {
    return getOrder([first], second)
  }
  if (!firstNumber && secondNumber) {
    return getOrder(first, [second])
  }
  const firstArray = first as NumberList
  const secondArray = second as NumberList
  const firstLength = (first as NumberList).length
  const secondLength = (second as NumberList).length
  for (let i = 0; i < Math.max(firstLength, secondLength); i++) {
    if (i >= firstLength) {
      return -1
    }
    if (i >= secondLength) {
      return 1
    }
    const order = getOrder(firstArray[i], secondArray[i])
    if (order !== 0) {
      return order
    }
  }
  return 0
}
