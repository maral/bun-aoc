export function parse(input: string) {
  return input.split('\n\n').map(group => group.split('\n'))
}

export function partOne(input: ReturnType<typeof parse>) {
  return input
    .map(group => {
      const set = new Set(group.join('').split(''))
      return set.size
    })
    .reduce((sum, size) => sum + size, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input
    .map(group => {
      return group[0]!.split('').filter(char => {
        return group.every(person => person.includes(char))
      }).length
    })
    .reduce((sum, size) => sum + size, 0)
}
