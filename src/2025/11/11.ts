import range from 'lodash.range'
import { parseNumbersGrid } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  const graph = new Map(
    input.split('\n').map(line => {
      const [from, to] = line.split(': ')
      return [from, { outputs: new Set(to.split(' ')), inputs: new Set() }]
    })
  )
  for (const [from, { outputs, inputs }] of graph.entries()) {
    for (const out of outputs.values()) {
      graph.get(out)?.inputs.add(from)
    }
  }
  return graph
}

export function partOne(graph: Input) {
  const pathCounts = new Map<string, number>()

  const noInput: string[] = []

  for (const [node, { inputs }] of graph.entries()) {
    if (inputs.size === 0) {
      noInput.push(node)
      pathCounts.set(node, 0)
    }
  }
  while (noInput.length > 0) {
    const node = noInput.pop()!
    if (node === 'you') {
      pathCounts.set(node, 1)
    }
    const paths = pathCounts.get(node)!
    for (const out of graph.get(node)!.outputs) {
      pathCounts.set(out, paths + (pathCounts.get(out) ?? 0))
      const outNode = graph.get(out)
      if (outNode) {
        outNode.inputs.delete(node)
        if (outNode.inputs.size === 0) {
          noInput.push(out)
        }
      }
    }
  }
  return pathCounts.get('out')
}

export function partTwo(graph: Input) {
  // 0 = without
  // 1 = with fft
  // 2 = with dac
  // 3 = with fft+dac
  const paths = new Map<string, [number, number, number, number]>()

  const noInput: string[] = ['svr']
  paths.set('svr', [1, 0, 0, 0])

  while (noInput.length > 0) {
    const node = noInput.pop()!

    const nodePaths = paths.get(node)!
    for (const out of graph.get(node)!.outputs) {
      const outPaths = paths.get(out) ?? [0, 0, 0, 0]

      if (node === 'fft') {
        outPaths[0] = 0
        outPaths[1] = nodePaths[0]
        outPaths[2] = 0
        outPaths[3] = outPaths[2] + nodePaths[2]
      } else if (node === 'dac') {
        outPaths[0] = 0
        outPaths[1] = 0
        outPaths[2] = nodePaths[0]
        outPaths[3] = outPaths[1] + nodePaths[1]
      } else {
        for (const i of range(outPaths.length)) {
          outPaths[i] += nodePaths[i]
        }
      }
      paths.set(out, outPaths)
      const outNode = graph.get(out)
      if (outNode) {
        outNode.inputs.delete(node)
        if (outNode.inputs.size === 0) {
          noInput.push(out)
        }
      }
    }
  }
  return paths.get('out')![3]
}
