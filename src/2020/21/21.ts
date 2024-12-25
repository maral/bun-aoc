import { intersection } from 'lodash'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  return input.split('\n').map(line => {
    const [ingredients, allergens] = line.split(' (contains ')
    return {
      ingredients: new Set(ingredients.split(' ')),
      allergens: new Set(
        allergens.substring(0, allergens.length - 1).split(', ')
      )
    }
  })
}

export function partOne(input: Input) {
  return processAllergens(input).inertIngredientsCount
}

export function partTwo(input: Input) {
  return processAllergens(input).dangerousIngredients
}

function processAllergens(input: Input) {
  const allAllergens = new Set<string>()
  for (const { allergens } of input) {
    allergens.forEach(a => allAllergens.add(a))
  }
  const dangerous: string[] = []
  const allergenMap = new Map<string, string>()

  while (allAllergens.size) {
    for (const a of allAllergens) {
      let possibilities = new Set<string>()
      for (const { ingredients, allergens } of input) {
        if (allergens.has(a)) {
          if (possibilities.size === 0) {
            possibilities = ingredients
          } else {
            possibilities = ingredients.intersection(possibilities)
          }
        }
      }
      if (possibilities.size === 1) {
        const ingredient = possibilities.values().next().value!
        dangerous.push(ingredient)
        allergenMap.set(ingredient, a)
        for (const line of input) {
          line.ingredients.delete(ingredient)
        }
        allAllergens.delete(a)
        break
      }
    }
  }

  return {
    inertIngredientsCount: input.reduce(
      (total, curr) => total + curr.ingredients.size,
      0
    ),
    dangerousIngredients: dangerous
      .sort((a, b) => (allergenMap.get(a)! < allergenMap.get(b)! ? -1 : 1))
      .join(',')
  }
}