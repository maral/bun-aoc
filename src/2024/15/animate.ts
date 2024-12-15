import { doubleMap, findStart, parse, printMap, robotStep } from './15'

const { default: input } = await import(`@/2024/15/input.txt`)
const sanitizedInput = input?.trim() ?? ''

// const sanitizedInput = `######
// #....#
// #.O@.#
// #....#
// #....#
// ######

// <<v`

const { map: origMap, instructions } = parse(sanitizedInput)

let map = doubleMap(origMap)
let position = findStart(map)
map[position[1]][position[0]] = '.'
for (const direction of instructions) {
  const nextStep = robotStep(map, position, direction)
  ;({ map, position } = nextStep)
  clearScreen()
  printMap(map, position)
  await Bun.sleep(400)
}

function clearScreen() {
  // Clears the terminal screen
  process.stdout.write('\u001b[2J\u001b[0;0H')
}
