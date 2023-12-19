type TokenType =
  | 'if'
  | 'else'
  | 'identifier'
  | 'number'
  | 'lessThan'
  | 'greaterThan'
  | 'accepted'
  | 'rejected'
  | 'unknown'

type Token = {
  type: TokenType
  value: string
  from: number
  to: number
}

type Category = 'x' | 'm' | 'a' | 's'

type AstAccepted = { type: 'accepted' }
type AstRejected = { type: 'rejected' }
type AstPointer = { type: 'pointer'; workflowName: string }
type AstTernary = {
  type: 'ternary'
  condition: Condition
  ifTrue: AstNode
  ifFalse: AstNode
}
type Condition = {
  category: Category
  operator: 'lessThan' | 'greaterThan'
  value: number
}
type AstNode = AstAccepted | AstRejected | AstPointer | AstTernary

type PartRanges = Record<Category, { from: number; to: number }>

export function parse(input: string) {
  const [workflows, ratings] = input.split('\n\n')

  return {
    workflows: Object.fromEntries(
      workflows!.split('\n').map(workflow => {
        const [name, conditions] = workflow.split('{')
        return [
          name!,
          parseWorkflow(conditions!.substring(0, conditions!.length - 1))
        ]
      })
    ),
    parts: ratings!.split('\n').map(rating => {
      return Object.fromEntries(
        rating
          .substring(1, rating.length - 1)
          .split(',')
          .map(keyValue => {
            const [key, value] = keyValue.split('=')
            return [key!, parseInt(value!)]
          })
      )
    }) as Record<Category, number>[]
  }
}

/* PART ONE */

export function partOne(input: ReturnType<typeof parse>) {
  return input.parts
    .map(part => {
      let workflow = 'in'
      while (true) {
        const result = processNode(input.workflows[workflow]!, part)
        if (result === 'accepted') {
          return Object.values(part).reduce((a, b) => a + b)
        } else if (result === 'rejected') {
          return 0
        }
        workflow = result
      }
    })
    .reduce((a, b) => a + b)
}

function processNode(
  node: AstNode,
  part: Record<Category, number>
): 'accepted' | 'rejected' | string {
  if (node.type === 'accepted') return 'accepted'
  if (node.type === 'rejected') return 'rejected'
  if (node.type === 'pointer') return node.workflowName

  const { category, operator, value } = node.condition
  if (
    (operator === 'greaterThan' && part[category] > value) ||
    (operator === 'lessThan' && part[category] < value)
  ) {
    return processNode(node.ifTrue, part)
  } else {
    return processNode(node.ifFalse, part)
  }
}

/* PART TWO */

export function partTwo(input: ReturnType<typeof parse>) {
  return calculatePossibilities(input.workflows, input.workflows['in']!, {
    x: { from: 1, to: 4000 },
    m: { from: 1, to: 4000 },
    a: { from: 1, to: 4000 },
    s: { from: 1, to: 4000 }
  })
}

function calculatePossibilities(
  workflows: Record<string, AstTernary>,
  node: AstNode,
  ranges: PartRanges
): number {
  if (node.type === 'rejected') return 0
  if (node.type === 'accepted') {
    return rangesPossibilities(ranges)
  }
  if (node.type === 'pointer') {
    return calculatePossibilities(
      workflows,
      workflows[node.workflowName]!,
      ranges
    )
  }

  const { category, operator, value } = node.condition
  const { from, to } = ranges[category]
  const truePart = cloneRanges(ranges)
  const falsePart = cloneRanges(ranges)
  if (operator === 'lessThan') {
    truePart[category].to = Math.min(to, value - 1)
    falsePart[category].from = Math.max(from, value)
  } else {
    truePart[category].from = Math.max(from, value + 1)
    falsePart[category].to = Math.min(to, value)
  }
  return (
    calculatePossibilities(workflows, node.ifTrue, truePart) +
    calculatePossibilities(workflows, node.ifFalse, falsePart)
  )
}

function rangesPossibilities(ranges: PartRanges) {
  return Object.values(ranges).reduce(
    (a, b) => a * (b.to >= b.from ? b.to - b.from + 1 : 0),
    1
  )
}

function cloneRanges(ranges: PartRanges) {
  return JSON.parse(JSON.stringify(ranges)) as PartRanges
}


/* LEXER */

export function getTokens(expression: string) {
  let tokens: Token[] = []
  let index = 0
  while (index < expression.length) {
    const token = parseToken(expression, index)
    if (token === null) break
    tokens.push(token)
    index = token.to
  }
  return tokens
}

function parseToken(expression: string, index: number): Token | null {
  if (index >= expression.length) return null
  let type: TokenType = getTokenType(expression[index]!)
  let start = index
  while (
    index < expression.length &&
    getTokenType(expression[index]!) === type
  ) {
    index++
  }
  const value = expression.slice(start, index)
  return { type, value, from: start, to: index }
}

function getTokenType(token: string): TokenType {
  if (token === ':') return 'if'
  if (token === ',') return 'else'
  if (token === 'A') return 'accepted'
  if (token === 'R') return 'rejected'
  if (token === '<') return 'lessThan'
  if (token === '>') return 'greaterThan'
  if (token.match(/^[0-9]+$/)) return 'number'
  if (token.match(/^[a-z]+$/)) return 'identifier'
  return 'unknown'
}

/* PARSER */

function parseWorkflow(expression: string): AstTernary {
  let index = 0
  const tokens = getTokens(expression)

  function getNextToken(): Token {
    if (index >= tokens.length) throw new Error('Unexpected end of input')
    return tokens[index++]!
  }

  function lookAhead(): Token | null {
    return tokens[index] ?? null
  }

  function parseTernary(): AstTernary {
    const condition = parseCondition()
    if (getNextToken().type !== 'if') reportParseError(`Expected ':'`)
    const ifTrue = parseExpression()
    if (getNextToken().type !== 'else') throw new Error(`Expected ','`)
    const ifFalse = parseExpression()

    return {
      type: 'ternary',
      condition: condition,
      ifTrue: ifTrue,
      ifFalse: ifFalse
    }
  }

  function parseExpression(): AstNode {
    const start = getNextToken()
    if (start.type === 'accepted') return { type: 'accepted' }
    if (start.type === 'rejected') return { type: 'rejected' }
    if (start.type === 'identifier') {
      const next = lookAhead()
      if (next === null || next.type === 'else') {
        return { type: 'pointer', workflowName: start.value }
      } else if (next.type === 'lessThan' || next.type === 'greaterThan') {
        index--
        return parseTernary()
      }
    }
    return reportParseError(`Expected 'A', 'R' or identifier.`)
  }

  function parseCondition(): Condition {
    const category = getNextToken()
    const operator = getNextToken()
    const value = getNextToken()
    return {
      category: category.value as Category,
      operator: operator.type as 'lessThan' | 'greaterThan',
      value: parseInt(value.value)
    }
  }

  function reportParseError(message: string): AstNode {
    const tokenPlace =
      index < tokens.length
        ? `, token '${tokens[index]!.value}' at index ${tokens[index]!.from}`
        : ' at the end'
    console.log(tokens)
    throw new Error(`Expression '${expression}'${tokenPlace}: ${message}`)
  }

  return parseTernary()
}
