type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n')
}

const naughtyCombs = /ab|cd|pq|xy/
const hasThreeVowels = /(a|e|i|o|u).*(a|e|i|o|u).*(a|e|i|o|u)/
const hasDoubleLetter = /(.)\1/
const hasDoublePair = /(..).*\1/
const hasSandwich = /(.).\1/

export function partOne(input: Input) {
  return input.filter(
    line =>
      !naughtyCombs.test(line) &&
      hasThreeVowels.test(line) &&
      hasDoubleLetter.test(line)
  ).length
}

export function partTwo(input: Input) {
  return input.filter(
    line => hasDoublePair.test(line) && hasSandwich.test(line)
  ).length
}
