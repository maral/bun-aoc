type Vector = { x: number; y: number; z: number }
type Hail = { position: Vector; velocity: Vector }

export function parse(input: string) {
  return input.split('\n').map(parseHail)
}

export function parseHail(line: string) {
  const [position, velocity] = line.split('@').map(part => {
    const [x, y, z] = part.trim().split(', ').map(Number)
    return { x: x!, y: y!, z: z! }
  })
  return { position: position!, velocity: velocity! }
}

export function partOne(input: ReturnType<typeof parse>) {
  return countFutureCollisions(input, 200000000000000, 400000000000000)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return findStoneStart(input)
}

export function findStoneStart(
  input: ReturnType<typeof parse>,
  upperBound = 500
) {
  const first = input[0]!
  const second = input[1]!
  let skipped = 0
  let computed = 0
  for (let vx = -upperBound; vx <= upperBound; vx++) {
    computed++
    for (let vy = -upperBound; vy <= upperBound; vy++) {
      computed++
      const v0: Vector = { x: vx, y: vy, z: 0 }
      const firstCollision = get2DCollisionPoint(first, second, v0)
      const secondCollision = get2DCollisionPoint(first, input[2]!, v0)
      if (
        firstCollision === 'never' ||
        secondCollision === 'never' ||
        firstCollision === 'everywhere' ||
        secondCollision === 'everywhere' ||
        !are2DVectorsEqual(firstCollision, secondCollision)
      ) {
        continue
      }
      for (let vz = -upperBound; vz <= upperBound; vz++) {
        computed++
        const velocity: Vector = { x: vx, y: vy, z: vz }

        if (canSkip(first, second, velocity)) {
          skipped++
          continue
        }

        const firstCollision = get2DCollisionPoint(first, second, velocity)
        if (firstCollision === 'never') continue
        if (firstCollision === 'everywhere') {
          throw new Error("Let's assume this never happens")
        }
        for (let i = 2; i < input.length + 1; i++) {
          if (i === input.length) {
            // everything collided, return the result
            return (
              Math.round(firstCollision.x) +
              Math.round(firstCollision.y) +
              Math.round(getZ(first, velocity, firstCollision.x))
            )
          }

          const collision = get2DCollisionPoint(first, input[i]!, velocity)
          if (collision === 'never') {
            break
          }
          if (collision === 'everywhere') {
            continue
          }
          if (!are2DVectorsEqual(firstCollision, collision)) {
            break
          }
          if (
            !twoFloatNumbersAreEqual(
              getZ(first, velocity, firstCollision.x),
              getZ(input[i]!, velocity, collision.x)
            )
          ) {
            break
          }
        }
      }
    }
  }
  return -1
}

export function countFutureCollisions(
  hails: Hail[],
  minXY: number,
  maxXY: number
) {
  let sum = 0
  for (const hail1 of hails) {
    for (const hail2 of hails) {
      if (hail1 === hail2) continue

      if (hailsWillCollideIn2D(hail1, hail2, minXY, maxXY)) {
        sum++
      }
    }
  }
  return sum / 2
}

function are2DVectorsEqual(first: Vector, second: Vector) {
  return (
    twoFloatNumbersAreEqual(second.x, first.x) &&
    twoFloatNumbersAreEqual(second.y, first.y)
  )
}

function twoFloatNumbersAreEqual(first: number, second: number) {
  return Math.abs(second - first) < 100
}

function canSkip(first: Hail, second: Hail, velocity: Vector) {
  return (
    canAxisSkip(first, second, velocity, 'x') ||
    canAxisSkip(first, second, velocity, 'y') ||
    canAxisSkip(first, second, velocity, 'z')
  )
}

function canAxisSkip(
  first: Hail,
  second: Hail,
  velocity: Vector,
  axis: 'x' | 'y' | 'z'
) {
  return (
    Math.sign(second.position[axis] - first.position[axis]) ===
    Math.sign(
      second.velocity[axis] -
        velocity[axis] -
        (first.velocity[axis] - velocity[axis])
    )
  )
}

function hailsWillCollideIn2D(
  hail1: Hail,
  hail2: Hail,
  minXY: number = -Infinity,
  maxXY: number = Infinity
) {
  const collisionResult = get2DCollisionPoint(hail1, hail2)

  if (collisionResult === 'never') {
    return false
  }

  if (collisionResult === 'everywhere') {
    return true
  }

  const { x, y } = collisionResult

  if (x < minXY || x > maxXY || y < minXY || y > maxXY) {
    return false
  }

  // now check if this happens in the future of both hails
  return isInFuture(hail1, x, y) && isInFuture(hail2, x, y)
}

function getZ(hail: Hail, velocity: Vector, x: number) {
  const xVelocity = hail.velocity.x - velocity.x
  const coefficient = (x - hail.position.x) / xVelocity
  return hail.position.z + coefficient * (hail.velocity.z - velocity.z)
}

function subtractVelocity(hail: Hail, velocity: Vector) {
  return {
    position: hail.position,
    velocity: {
      x: hail.velocity.x - velocity.x,
      y: hail.velocity.y - velocity.y,
      z: hail.velocity.z - velocity.z
    }
  }
}

export function get2DCollisionPoint(
  hail1: Hail,
  hail2: Hail,
  velocity: Vector | null = null
): Vector | 'never' | 'everywhere' {
  if (velocity !== null) {
    hail1 = subtractVelocity(hail1, velocity)
    hail2 = subtractVelocity(hail2, velocity)
  }
  const k1 = getCoefficient(hail1)
  const k2 = getCoefficient(hail2)
  const c1 = getConstant(hail1)
  const c2 = getConstant(hail2)

  // if the lines are parallel, they will collide only if they share the same constant
  if (k1 === k2) {
    return c1 === c2 ? 'everywhere' : 'never'
  }

  const x = -(c1 - c2) / (k1 - k2)
  const y = k1 * x + c1

  return { x, y, z: 0 }
}

function getCoefficient(hail: Hail) {
  return hail.velocity.y / hail.velocity.x
}

function getConstant(hail: Hail) {
  return hail.position.y - getCoefficient(hail) * hail.position.x
}

function isInFuture(hail: Hail, x: number, y: number) {
  return isAxisInFuture(hail, x, 'x') && isAxisInFuture(hail, y, 'y')
}

function isAxisInFuture(hail: Hail, position: number, axis: 'x' | 'y') {
  return (
    hail.position[axis] === position ||
    Math.sign(position - hail.position[axis]) === Math.sign(hail.velocity[axis])
  )
}

function getPositionInTime(hail: Hail, time: number): Vector {
  return {
    x: hail.position.x + time * hail.velocity.x,
    y: hail.position.y + time * hail.velocity.y,
    z: hail.position.z + time * hail.velocity.z
  }
}

function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomIntegers(min: number, max: number, count: number) {
  const result = new Set<number>()
  while (result.size < count) {
    result.add(getRandomInteger(min, max))
  }
  return Array.from(result)
}
