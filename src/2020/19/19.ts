type Input = ReturnType<typeof parse>

type Terminal = 'a' | 'b'
type NonTerminal = number
type Token = Terminal | NonTerminal
type RuleMap = Map<number, Token[][]>

export function parse(input: string) {
  const [r, m] = input.split('\n\n')
  return {
    rules: new Map(
      r.split('\n').map(line => {
        const [n, rest] = line.split(': ')

        return [
          parseInt(n),
          rest
            .split(' | ')
            .map(seq =>
              seq
                .split(' ')
                .map(r =>
                  r !== '"a"' && r !== '"b"'
                    ? parseInt(r)
                    : (r.substring(1, 2) as Terminal)
                )
            )
        ]
      })
    ),
    messages: m.split('\n')
  }
}

export function partOne(input: Input) {
  return input.messages.filter(m => matchesRules(m, input.rules)).length
}

export function partTwo(input: Input) {
  input.rules.set(8, [[42], [42, 8]])
  input.rules.set(11, [
    [42, 31],
    [42, 11, 31]
  ])
  return input.messages.filter(m => matchesRules(m, input.rules)).length
}

function matchesRules(message: string, ruleMap: RuleMap) {
  return consumeRule(message, 0, 0, ruleMap).has(message.length)
}

function consumeRule(
  message: string,
  ruleNumber: number,
  index: number,
  ruleMap: RuleMap
): Set<number> {
  const result = new Set<number>()

  const variants = ruleMap.get(ruleNumber)!

  for (const variant of variants) {
    let indices = new Set<number>([index])

    for (const token of variant) {
      const nextIndices = new Set<number>()
      for (const i of indices) {
        if (i >= message.length) {
          continue
        }
        if (token === 'a' || token === 'b') {
          if (message[i] === token) {
            nextIndices.add(i + 1)
          }
        } else {
          consumeRule(message, token, i, ruleMap).forEach(r =>
            nextIndices.add(r)
          )
        }
      }
      indices = nextIndices
    }
    indices.forEach(n => result.add(n))
  }

  return result
}
