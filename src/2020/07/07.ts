type Bags = Record<string, Map<string, number>>

export function parse(input: string) {
  const bags: Record<string, Map<string, number>> = {}

  input.split('\n').forEach(line => {
    const [parentColor, contains] = line.split(' bags contain ')
    const childBags = new Map<string, number>()

    if (contains !== 'no other bags.') {
      const bagContents = contains!.split(', ')
      bagContents.forEach(content => {
        const [quantity, color1, color2] = content.split(' ')
        const color = color1 + ' ' + color2
        childBags.set(color, parseInt(quantity!))
      })
    }

    bags[parentColor!] = childBags
  })

  return bags
}

const toFind = 'shiny gold'

export function partOne(input: ReturnType<typeof parse>) {
  return findParentColors(input, toFind).size
}

function findParentColors(bags: Bags, toFind: string): Set<string> {
  const colors = new Set<string>()
  for (const [parentColor, bag] of Object.entries(bags)) {
    if (bag.has(toFind)) {
      colors.add(parentColor)
      const grandParentColors = findParentColors(bags, parentColor)
      grandParentColors.forEach(color => colors.add(color))
    }
  }

  return colors
}

export function partTwo(input: ReturnType<typeof parse>) {
  return totalBagCount(input, toFind)
}

function totalBagCount(bags: Bags, toFind: string): number {
  let count = 0
  for (const [childColor, quantity] of bags[toFind]!) {
    count += quantity + quantity * totalBagCount(bags, childColor)
  }
  return count
}
