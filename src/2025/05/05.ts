type Input = ReturnType<typeof parse>

export function parse(input: string) {
  const [ranges, ingredients] = input.split('\n\n')
  return {
    ranges: ranges.split('\n').map(line => line.split('-').map(n => Number(n))),
    ingredients: ingredients.split('\n').map(line => Number(line))
  }
}

export function partOne({ ranges, ingredients }: Input) {
  let fresh = 0
  for (const ingredient of ingredients) {
    if (ranges.some(([from, to]) => from <= ingredient && ingredient <= to)) {
      fresh++
    }
  }
  return fresh
}

export function partTwo({ ranges }: Input) {
  const processed = new Set<{ from: number; to: number }>()
  for (let [from, to] of ranges) {
    for (const range of processed.values()) {
      if (from <= range.to && range.from <= to) {
        from = Math.min(from, range.from)
        to = Math.max(to, range.to)
        processed.delete(range)
      }
    }
    processed.add({ from, to })
  }

  let fresh = 0
  for (const { from, to } of processed.values()) {
    fresh += to - from + 1
  }
  return fresh
}
