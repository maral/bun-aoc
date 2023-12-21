import { Queue } from 'js-sdsl'
import lcm from 'compute-lcm'

type Broadcaster = {
  type: 'broadcaster'
}

type FlipFlop = {
  type: '%'
  state: 'on' | 'off'
}

type Conjunction = {
  type: '&'
  inputs: Record<string, Pulse>
}

type Module = { outputs: string[] } & (Broadcaster | FlipFlop | Conjunction)

type Pulse = 'high' | 'low'

type Step = { from: string; to: string; pulse: Pulse }

export function parse(input: string) {
  const modules = Object.fromEntries(
    input.split('\n').map(line => {
      const [module, outputList] = line.split(' -> ')
      const outputs = outputList!.split(', ')
      if (module![0] === '%') {
        return [module!.substring(1), { type: '%', state: 'off', outputs }]
      } else if (module![0] === '&') {
        return [module!.substring(1), { type: '&', inputs: {}, outputs }]
      } else {
        return [module!, { type: 'broadcaster', outputs }]
      }
    })
  ) as Record<string, Module>

  Object.keys(modules).forEach(name => {
    modules[name]!.outputs.forEach(key => {
      if (!modules[key]) {
        modules[key] = { outputs: [], type: '&', inputs: {} }
      }
      const output = modules[key]
      if (output && output.type === '&') {
        output.inputs[name] = 'low'
      }
    })
  })

  return modules
}

export function partOne(modules: Record<string, Module>) {
  let totalLows = 0,
    totalHighs = 0
  for (let i = 0; i < 1000; i++) {
    let lows = 0,
      highs = 0

    pushButton(modules, step => {
      if (step.pulse === 'low') {
        lows++
      } else {
        highs++
      }
    })
    totalLows += lows
    totalHighs += highs
  }
  return totalHighs * totalLows
}

export function partTwo(modules: Record<string, Module>) {
  return pushesUntil(modules, 'rx', 'low')
}

export function pushesUntil(
  modules: Record<string, Module>,
  target: string,
  pulse: Pulse
): number {
  const module = modules[target]

  if (
    module &&
    module.type === '&' &&
    allInputsAreConjunctions(modules, module) &&
    allGrandparentsAreConjunctions(modules, module)
  ) {
    const results = Object.keys(module.inputs).map(input => {
      const pushes = pushesUntil(modules, input, togglePulse(pulse))
      return pushes
    })
    return results.length === 1 ? results[0]! : lcm(results)!
  }

  const clonedInput = JSON.parse(JSON.stringify(modules)) as Record<
    string,
    Module
  >
  let i = 0
  let success = false
  while (true) {
    i++
    pushButton(clonedInput, step => {
      if (step.to === target && step.pulse === pulse) {
        success = true
      }
    })
    if (success) {
      return i
    }
  }
}

function pushButton(
  input: Record<string, Module>,
  onPulse: (step: Step) => void
) {
  const queue = new Queue<{ from: string; to: string; pulse: Pulse }>()
  queue.push({ from: 'button', to: 'broadcaster', pulse: 'low' })
  while (queue.size() > 0) {
    const step = queue.pop()!
    onPulse(step)
    const module = input[step.to]
    if (!module) {
      continue
    }

    if (module.type === '%' && step.pulse === 'low') {
      module.outputs.forEach(output => {
        queue.push({
          from: step.to,
          to: output,
          pulse: module.state === 'off' ? 'high' : 'low'
        })
      })
      module.state = module.state === 'off' ? 'on' : 'off'
    } else if (module.type === '&') {
      module.inputs[step.from] = step.pulse
      const newPulse = Object.values(module.inputs).every(
        input => input === 'high'
      )
        ? 'low'
        : 'high'
      module.outputs.forEach(output => {
        queue.push({
          from: step.to,
          to: output,
          pulse: newPulse
        })
      })
    } else if (module.type === 'broadcaster') {
      module.outputs.forEach(output => {
        queue.push({
          from: step.to,
          to: output,
          pulse: step.pulse
        })
      })
    }
  }
}

function allGrandparentsAreConjunctions(
  modules: Record<string, Module>,
  module: Module
) {
  return (
    module.type === '&' &&
    Object.keys(module.inputs).every(input =>
      allInputsAreConjunctions(modules, modules[input]!)
    )
  )
}

function allInputsAreConjunctions(
  modules: Record<string, Module>,
  module: Module
) {
  return (
    module.type === '&' &&
    Object.keys(module.inputs).every(input => modules[input]!.type === '&')
  )
}

function togglePulse(pulse: Pulse) {
  return pulse === 'low' ? 'high' : 'low'
}
