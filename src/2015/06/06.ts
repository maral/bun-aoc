import range from 'lodash.range'

type Input = ReturnType<typeof parse>
type Command = 'on' | 'toggle' | 'off'
type Process = (prev: number) => number
type Commands = Record<Command, Process>

export function parse(input: string) {
  return input.split('\n').map(line => {
    const groups = line.match(
      /(turn on|toggle|turn off) (\d+),(\d+) through (\d+),(\d+)/
    )!

    const cmd = groups[1].split(' ')
    return {
      command: cmd[cmd.length - 1] as Command,
      bounds: groups.slice(2).map(n => parseInt(n))
    }
  })
}

export function partOne(input: Input) {
  return processGrid(input, {
    on: _ => 1,
    toggle: prev => (prev ? 0 : 1),
    off: _ => 0
  })
}

export function partTwo(input: Input) {
  return processGrid(input, {
    on: prev => prev + 1,
    toggle: prev => prev + 2,
    off: prev => Math.max(prev - 1, 0)
  })
}

export function processGrid(input: Input, commands: Commands) {
  const grid = range(1000).map(_ => range(1000).map(_ => 0))
  for (const { command, bounds } of input) {
    range(bounds[0], bounds[2] + 1).map(x =>
      range(bounds[1], bounds[3] + 1).forEach(y => {
        grid[y][x] = commands[command](grid[y][x])
      })
    )
  }
  return grid.reduce((sum, row) => sum + row.reduce((s, n) => s + n, 0), 0)
}
