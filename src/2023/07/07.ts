type Hand = {
  cards: string
  bid: number
}

const firstReplaceMap: Record<string, string> = {
  T: 'A',
  J: 'B',
  Q: 'C',
  K: 'D',
  A: 'E'
}

const secondReplaceMap: Record<string, string> = {
  T: 'A',
  J: '!',
  Q: 'C',
  K: 'D',
  A: 'E'
}

export function parse(input: string): Hand[] {
  return input
    .split('\n')
    .map(n => n.trim())
    .filter(n => n.length > 0)
    .map(n => {
      const [cards = '', bid] = n.split(' ')
      return {
        cards,
        bid: parseInt(bid!)
      }
    })
}

export function partOne(input: ReturnType<typeof parse>) {
  const updated = input.map(hand => ({
    cards: replaceAll(getStrength(hand) + hand.cards, firstReplaceMap),
    bid: hand.bid
  }))
  updated.sort((a, b) => a.cards.localeCompare(b.cards))
  return updated.map((hand, i) => (i + 1) * hand.bid).reduce((a, b) => a + b, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  const updated = input.map(hand => ({
    cards: replaceAll(getStrength(hand, true) + hand.cards, secondReplaceMap),
    bid: hand.bid,
    original: hand.cards
  }))
  updated.sort((a, b) => a.cards.localeCompare(b.cards))
  return updated.map((hand, i) => (i + 1) * hand.bid).reduce((a, b) => a + b, 0)
}

function replaceAll(str: string, map: Record<string, string>) {
  return str
    .split('')
    .map(n => map[n] || n)
    .join('')
}

function getStrength(hand: Hand, jokers = false): string {
  const frequencies = cardFrequencies(hand.cards, jokers)
  const jokerCount = jokers ? frequencies.shift()! : 0
  const first = jokerCount === 5 ? 5 : frequencies[0]! + jokerCount
  const second = frequencies[1] || 0

  if (first === 5) return '9'
  if (first === 4) return '8'
  if (first === 3) {
    if (second === 2) return '7'
    return '6'
  }
  if (first === 2) {
    if (second === 2) return '5'
    return '4'
  }
  return '3'
}

function cardFrequencies(cards: string, jokers = false) {
  const frequencyMap = cards.split('').reduce(
    (acc, n) => {
      acc[n] = (acc[n] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  if (jokers) {
    let jokers = frequencyMap['J'] || 0
    if ('J' in frequencyMap) {
      delete frequencyMap['J']
    }
    const frequencies = Object.values(frequencyMap)
    frequencies.sort()
    frequencies.push(jokers)
    frequencies.reverse()
    return frequencies
  } else {
    const frequencies = Object.values(frequencyMap)
    frequencies.sort().reverse()
    return frequencies
  }
}
