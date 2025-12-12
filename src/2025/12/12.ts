import { Coord, sum } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  const parts = input.split('\n\n')
  return {
    shapes: parts
      .slice(0, parts.length - 1)
      .map(part => part.split('\n').slice(1)),
    regions: parts[parts.length - 1].split('\n').map(line => {
      const [size, quantities] = line.split(': ')
      return {
        size: size.split('x').map(n => Number(n)) as Coord,
        quantities: quantities.split(' ').map(n => Number(n))
      }
    })
  }
}

export function partOne({ shapes, regions }: Input) {
  const pieces: number[] = []
  for (const shape of shapes) {
    pieces.push(shape.flatMap(l => l.split('')).filter(c => c === '#').length)
  }

  let total = 0
  for (const { size, quantities } of regions) {
    if (sum(quantities.map((q, i) => q * pieces[i])) < size[0] * size[1]) {
      total++
    }
  }
  return total
}

export function partTwo(input: Input) {}
