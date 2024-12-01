export function parse(input: string) {
  return input
    .split('\n')
    .map(line => [line[0], parseInt(line.substring(1))] as [string, number])
}

const directions = ['E', 'S', 'W', 'N']
const commandToDirection = {
  E: 0,
  S: 1,
  W: 2,
  N: 3
}
const dirToDelta = [
  [1, 0],
  [0, -1],
  [-1, 0],
  [0, 1]
]

export function partOne(input: ReturnType<typeof parse>) {
  let direction = 0
  let position = [0, 0] as [number, number]

  for (const [command, arg] of input) {
    switch (command) {
      case 'L':
      case 'R':
        direction =
          (direction + (command === 'L' ? -1 : 1) * (arg / 90) + 4) % 4
        break
      case 'F':
        position = getNewPosition(position, direction, arg)
        break
      case 'E':
      case 'S':
      case 'W':
      case 'N':
        position = getNewPosition(position, commandToDirection[command], arg)
        break
    }
  }
  return Math.abs(position[0]) + Math.abs(position[1])
}

export function partTwo(input: ReturnType<typeof parse>) {
  let shipPosition = [0, 0] as [number, number]
  let waypointPosition = [10, 1] as [number, number]

  for (const [command, arg] of input) {
    switch (command) {
      case 'L':
      case 'R':
        waypointPosition = rotate(
          waypointPosition,
          command,
          ((arg + 360) % 360) as 90 | 180 | 270
        )
        break
      case 'F':
        shipPosition = [
          shipPosition[0] + waypointPosition[0] * arg,
          shipPosition[1] + waypointPosition[1] * arg
        ]
        break
      case 'E':
      case 'S':
      case 'W':
      case 'N':
        waypointPosition = getNewPosition(
          waypointPosition,
          commandToDirection[command],
          arg
        )
        break
    }
  }
  return Math.abs(shipPosition[0]) + Math.abs(shipPosition[1])
}

function getNewPosition(
  prevPosition: [number, number],
  direction: number,
  value: number
): [number, number] {
  return [
    prevPosition[0] + dirToDelta[direction][0] * value,
    prevPosition[1] + dirToDelta[direction][1] * value
  ]
}

function rotate(
  point: [number, number],
  direction: 'L' | 'R',
  degrees: 90 | 180 | 270
): [number, number] {
  const [x, y] = point

  const rotations = {
    L: {
      90: [-y, x],
      180: [-x, -y],
      270: [y, -x]
    },
    R: {
      90: [y, -x],
      180: [-x, -y],
      270: [-y, x]
    }
  }

  return rotations[direction][degrees] as [number, number]
}
