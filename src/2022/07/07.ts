import { sum } from '@/utils'

type Input = ReturnType<typeof parse>

type CdCommand = {
  type: 'cd'
  arg: string
}
type LsCommand = {
  type: 'ls'
}
type DirOutput = {
  type: 'dir'
  name: string
}
type FileOutput = {
  type: 'file'
  name: string
  size: number
}
type Line = CdCommand | LsCommand | DirOutput | FileOutput

type BaseNode = {
  parent: Folder | null
  name: string
  size: number
}
type File = BaseNode
type Folder = BaseNode & {
  folders: Folder[]
  files: File[]
}

export function parse(input: string): Line[] {
  return input.split('\n').map(line => parseLine(line))
}

function parseLine(line: string): Line {
  const terms = line.split(' ')
  if (terms[0] === '$') {
    if (terms[1] === 'cd') {
      return {
        type: 'cd',
        arg: terms[2]!
      }
    }
    return {
      type: 'ls'
    }
  }
  if (terms[0] === 'dir') {
    return {
      type: 'dir',
      name: terms[1]
    }
  }
  return {
    type: 'file',
    name: terms[1],
    size: Number(terms[0])
  }
}

function mkdir(name: string, parent: Folder | null): Folder {
  return {
    name,
    parent,
    files: [],
    folders: [],
    size: -1
  }
}

function touch(name: string, parent: Folder, size: number): File {
  return {
    name,
    parent,
    size
  }
}

export function partOne(input: Input) {
  const root = prepareFileSystem(input)
  return sumCandidates(root)
}

function sumCandidates(folder: Folder): number {
  return (
    (folder.size <= 100000 ? folder.size : 0) +
    sum(folder.folders.map(f => sumCandidates(f)))
  )
}

export function partTwo(input: Input) {
  const root = prepareFileSystem(input)
  return findFolderToDelete(root, root.size - 40_000_000)
}

function findFolderToDelete(folder: Folder, minSize: number): number {
  return Math.min(
    folder.size >= minSize ? folder.size : Infinity,
    ...folder.folders.map(f => findFolderToDelete(f, minSize))
  )
}

function prepareFileSystem(input: Input): Folder {
  const root = mkdir('/', null)
  let cwd = root
  for (const line of input) {
    switch (line.type) {
      case 'cd': {
        if (line.arg === '..') {
          cwd = cwd.parent!
        } else if (line.arg === '/') {
          cwd = root
        } else {
          cwd = cwd.folders.find(node => node.name === line.arg)!
        }
        break
      }
      case 'dir': {
        cwd.folders.push(mkdir(line.name, cwd))
        break
      }
      case 'file': {
        cwd.files.push(touch(line.name, cwd, line.size))
      }
      case 'ls':
      default: {
        break
      }
    }
  }
  calculateSizes(root)
  return root
}

function calculateSizes(folder: Folder): number {
  folder.size =
    sum(folder.files.map(file => file.size)) +
    sum(folder.folders.map(f => calculateSizes(f)))
  return folder.size
}
