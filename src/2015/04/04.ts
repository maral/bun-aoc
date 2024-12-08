type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input
}

export function partOne(input: Input) {
  const hasher = new Bun.CryptoHasher('md5')
  const getMd5 = (s: string): string => {
    hasher.update(s)
    return hasher.digest('hex')
  }
  let i = 1
  while (true) {
    if (getMd5(input + i).startsWith('00000')) {
      return i
    }
    i++
  }
}

export function partTwo(input: Input) {
  const hasher = new Bun.CryptoHasher('md5')
  const getMd5 = (s: string): string => {
    hasher.update(s)
    return hasher.digest('hex')
  }
  let i = 1
  while (true) {
    if (getMd5(input + i).startsWith('000000')) {
      return i
    }
    i++
  }
}
