import { Coord, parseNumbersGrid, rangesOverlap } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return parseNumbersGrid(input, ',') as Coord[]
}

export function partOne(input: Input) {
  let max = 0
  for (const first of input) {
    for (const second of input) {
      if (first >= second) {
        continue
      }
      max = Math.max(max, getArea(first, second))
    }
  }
  return max
}

function getArea([x1, y1]: Coord, [x2, y2]: Coord) {
  return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1)
}

type Range = Coord
type CornerMap = Map<Coord, Range>

export function partTwo(input: Input) {
  input.sort((a, b) => (a[0] - b[0]) * 10000 + a[1] - b[1])

  let max = 0
  // y => x
  const openCorners = new Map<Coord, Range>()
  let ranges: Range[] = []

  for (let i = 0; i < input.length; i += 2) {
    const start = input[i]
    const end = input[i + 1]

    if (ranges.length === 0) {
      ranges.push([start[1], end[1]])
    } else {
      // try out new corners
      max = Math.max(max, getMax(openCorners, start))
      max = Math.max(max, getMax(openCorners, end))

      // update ranges - remove closed ranges
      ranges = ranges.filter(r => r[0] !== start[1] || r[1] !== end[1])

      for (const range of ranges) {
        // update range - shrinking
        if (start[1] === range[0]) {
          range[0] = end[1]
        }
        if (end[1] === range[1]) {
          range[1] = start[1]
        }
        // update range - expanding
        if (end[1] === range[0]) {
          range[0] = start[1]
        }
        if (start[1] === range[1]) {
          range[1] = end[1]
        }
      }

      // clean up corners
      for (const [corner, cornerRange] of openCorners.entries()) {
        if (!ranges.some(range => rangesOverlap(cornerRange, range))) {
          openCorners.delete(corner)
        } else {
          const range = ranges.find(
            r => rangesOverlap(cornerRange, r) && inRange(r, corner)
          )!
          console.log('corner cleanup', corner)
          console.log('found range', range)
          console.log('corner range', cornerRange)
          console.log('new range', [
            Math.max(cornerRange[0], range[0]),
            Math.min(cornerRange[1], range[1])
          ])
          openCorners.set(corner, [
            Math.max(cornerRange[0], range[0]),
            Math.min(cornerRange[1], range[1])
          ])
        }
      }
    }
    // add new corners
    const startRange = ranges.find(r => inRange(r, start))
    if (startRange) {
      openCorners.set(start, [...startRange])
    }
    const endRange = ranges.find(r => inRange(r, end))
    if (endRange) {
      openCorners.set(end, [...endRange])
    }
  }
  return max
}

function getMax(openCorners: CornerMap, point: Coord) {
  return Math.max(
    ...openCorners
      .entries()
      .map(([corner, range]) =>
        inRange(range, point) ? getArea(corner, point) : 0
      )
  )
}

function inRange(range: Range, newCoord: Coord) {
  return range[0] <= newCoord[1] && newCoord[1] <= range[1]
}

/*
...............
...##########.........
...#........#..
...#...######.......
...#...#....
...#...####....
...#......#....
...#......#....
...#......#....
...########...........
...............
...............
...............
...............


*/