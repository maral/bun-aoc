import lcm from 'compute-lcm'

type DesertMap = {
  instructions: string
  map: Record<string, [string, string]>
}

export function parse(input: string): DesertMap {
  const [instructions, _, ...map] = input.split('\n')
  return {
    instructions: instructions!,
    map: Object.fromEntries(
      map.map(row => [
        row.substring(0, 3),
        [row.substring(7, 10), row.substring(12, 15)]
      ])
    )
  }
}

const start = 'AAA'
const end = 'ZZZ'

export function partOne({ instructions, map }: ReturnType<typeof parse>) {
  return getStepCount(start, { instructions, map }, loc => loc === end)
}

const startLetter = 'A'
const endLetter = 'Z'

export function partTwo({ instructions, map }: ReturnType<typeof parse>) {
  let stepCounts = Object.keys(map)
    .filter(loc => loc[2] === startLetter)
    .map(loc =>
      getStepCount(loc, { instructions, map }, loc => loc[2] === endLetter)
    )
  return lcm(stepCounts as number[])
}

function getStepCount(
  location: string,
  { instructions, map }: DesertMap,
  isEndLocation: (loc: string) => boolean
) {
  let counter = 0
  const steps = [location]
  while (!(isEndLocation(location) && counter > 0)) {
    for (let i = 0; i < instructions.length; i++) {
      counter++
      location = map[location]![instructions[i] === 'L' ? 0 : 1]
      steps.push(location)
    }
  }

  return counter
}
