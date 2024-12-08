import range from 'lodash.range'
import { parseNumbersGrid } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  const [rangesRaw, ticketRaw, othersRaw] = input.split('\n\n')
  return {
    ranges: rangesRaw.split('\n').map(line =>
      line
        .split(': ')[1]
        .split(' or ')
        .map(range => range.split('-').map(n => parseInt(n)))
    ),
    myTicket: ticketRaw
      .split('\n')[1]
      .split(',')
      .map(n => parseInt(n)),
    nearby: parseNumbersGrid(
      othersRaw.substring('nearby tickets:\n'.length),
      ','
    )
  }
}

export function partOne({ nearby, ranges }: Input) {
  const flatRanges = ranges.flat(1)
  let sum = 0
  for (const n of nearby.flat()) {
    if (!flatRanges.some(([from, to]) => from <= n && n <= to)) sum += n
  }
  return sum
}

export function partTwo({ nearby, myTicket, ranges }: Input) {
  const flatRanges = ranges.flat(1)
  const validTickets = nearby.filter(ticket =>
    ticket.every(n => flatRanges.some(([from, to]) => from <= n && n <= to))
  )

  const possibleRanges = new Map<number, Set<number>>()
  for (let i = 0; i < validTickets[0].length; i++) {
    possibleRanges.set(
      i,
      new Set(
        ranges
          .map((doubleRange, rangeIndex) =>
            validTickets.every(ticket =>
              doubleRange.some(
                ([from, to]) => from <= ticket[i] && ticket[i] <= to
              )
            )
              ? rangeIndex
              : null
          )
          .filter(index => index !== null)
      )
    )
  }

  // fieldIndex -> ticketNumberIndex
  const fieldMap = new Map<number, number>()

  while (possibleRanges.size) {
    const [ticketNumberIndex, fieldIndices] = possibleRanges
      .entries()
      .find(([_, fieldIndices]) => fieldIndices.size === 1)!
    const fieldIndex = fieldIndices.values().next().value!
    fieldMap.set(fieldIndex, ticketNumberIndex)
    possibleRanges.delete(ticketNumberIndex)
    possibleRanges.forEach(fieldIndices => fieldIndices.delete(fieldIndex))
  }

  let product = 1
  for (const i of range(6)) {
    product *= myTicket[fieldMap.get(i)!]
  }

  return product
}
