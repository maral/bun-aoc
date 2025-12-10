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
  input.sort((a, b) => (a[0] - b[0]) * 100000 + a[1] - b[1])

  let max = 0
  // y => x
  const openCorners = new Map<Coord, Range>()
  let ranges: Range[] = []

  for (let i = 0; i < input.length; i += 2) {
    const start = input[i]
    const end = input[i + 1]
    const newRange = [start[1], end[1]] as Range

    if (ranges.length === 0) {
      ranges.push(newRange)
    } else {
      // try out new corners
      const prevMax = max
      max = Math.max(max, getMax(openCorners, start))
      max = Math.max(max, getMax(openCorners, end))
      if (max > prevMax) {
      }

      const nextRanges: Range[] = []
      for (const range of ranges) {
        if (rangesEqual(range, newRange)) {
          // do nothing
        } else if (rangeWithinRange(range, newRange)) {
          // split ranges
          nextRanges.push([range[0], newRange[0]])
          nextRanges.push([newRange[1], range[1]])
        } else {
          // update range - shrinking
          if (newRange[0] === range[0]) {
            range[0] = newRange[1]
          } else if (newRange[1] === range[1]) {
            range[1] = newRange[0]
          }
          // update range - expanding
          else if (newRange[1] === range[0]) {
            range[0] = newRange[0]
          } else if (newRange[0] === range[1]) {
            range[1] = newRange[1]
          }
          nextRanges.push(range)
        }
      }

      if (!ranges.some(range => rangesOverlap(range, newRange))) {
        // range outside - add new range
        nextRanges.push(newRange)
      }
      nextRanges.sort((a, b) => a[0] - b[0])
      const cleanedRanges: Range[] = []
      // merge overlapping
      for (let i = 0; i < nextRanges.length; i++) {
        if (
          i < nextRanges.length - 1 &&
          rangesOverlap(nextRanges[i], nextRanges[i + 1])
        ) {
          cleanedRanges.push(mergeRanges(nextRanges[i], nextRanges[i + 1])!)
          i++
        } else {
          cleanedRanges.push(nextRanges[i])
        }
      }
      ranges = cleanedRanges

      // clean up corners
      for (const [corner, cornerRange] of openCorners.entries()) {
        if (
          !ranges.some(
            range => rangesOverlap(cornerRange, range) && inRange(range, corner)
          )
        ) {
          openCorners.delete(corner)
        } else {
          const range = ranges.find(
            r => rangesOverlap(cornerRange, r) && inRange(r, corner)
          )!
          const intersection = getRangeIntersection(range, cornerRange)
          if (intersection) {
            openCorners.set(corner, intersection)
          }
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
  const x = openCorners
    .entries()
    .map(([corner, range]) => [
      corner,
      inRange(range, point) ? getArea(corner, point) : 0
    ] as [Coord, number]).toArray()
  const max = Math.max(...x.map(y => y[1]))
  console.log('max', max)
  console.log(x[x.findIndex(y => y[1] === max)][0])
  console.log(point)
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

function rangeWithinRange(range: Range, rangeToCheck: Range) {
  return range[0] < rangeToCheck[0] && rangeToCheck[1] < range[1]
}

function rangesEqual(range1: Range, range2: Range) {
  return range1[0] === range2[0] && range1[1] === range2[1]
}

function getRangeIntersection(range1: Range, range2: Range) {
  if (!rangesOverlap(range1, range2)) {
    return null
  }
  return [
    Math.max(range1[0], range2[0]),
    Math.min(range1[1], range2[1])
  ] as Range
}

function mergeRanges(range1: Range, range2: Range) {
  if (!rangesOverlap(range1, range2)) {
    return null
  }
  return [
    Math.min(range1[0], range2[0]),
    Math.max(range1[1], range2[1])
  ] as Range
}
