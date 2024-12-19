import { sum } from '../../utils'

type Input = ReturnType<typeof parse>

export function parse(input: string) {
  const [towels, patterns] = input.split('\n\n')
  return {
    towels: towels.split(', '),
    patterns: patterns.split('\n').map(p => p.split('') as Color[])
  }
}

type Color = 'r' | 'g' | 'b' | 'w' | 'u'

type Node = { [key in Color]?: Node } & { valid?: true; prefix: string }

export function partOne(input: Input) {
  const search = buildSearch(input)

  return input.patterns.filter(p => combinations(p, search, search, 0) > 0)
    .length

  // using regex
  // const inputPattern = /^(rwrwr|ruu|bwwubu|ugrubg|wg|wbg|ugr|bgr|uruug|ruubw|rwr|rwbbb|rrrgb|ruru|wggru|ruw|bgu|wgg|ggbbbb|rr|guwwbw|gru|bwurb|bbwburg|ubb|wuuuu|urb|brwr|uwr|rruww|ubgwgwr|ugb|urbgwug|bub|grrb|wugbr|ggwu|bug|ruuw|ugwu|brurgb|rug|uwg|rrw|rgrggwu|rgbrr|brgr|rwrbu|ggw|wrbrb|bgwb|urgr|brgub|rwbbwub|rwgbur|wggr|wurww|wbbgwg|rw|urbu|grgbwu|ru|uuuguu|bwuggbrr|buw|ubgw|gburrb|urwbb|ububggg|bwbr|bgwug|grr|wggu|rrgu|wwuu|ggu|rggbuu|grwwru|rrbu|bwggrb|ggr|brgu|gbgr|bbubwugg|brrr|uwggru|rrb|rwwwbbu|urrr|guug|u|gwrrugw|wrwgr|guwg|rwu|wuww|wurrg|bugu|wrr|wwrr|bwrrw|guu|ubugb|rguw|uurbb|wuwwuw|uwbbgbwg|uuwruub|bggww|bugbrubu|brwrwbb|gbur|wrgbru|bbu|bgubwgu|uw|gbg|wbwwb|rrruwgw|rgw|bbg|ggwg|wug|bgugr|rwb|bggb|gwww|wwww|bwrwb|rwguwu|rrwrbb|br|wbr|bguu|gurrb|wuw|gurg|ggg|brbrrgr|gruu|rbgb|uwgrw|wwwuu|gbburrru|wbwwww|wgw|gbwb|ugww|gbr|uugrug|gw|rrwu|urg|brr|rb|uwb|wwuuu|bbrwb|gwu|wugrw|ugu|wruwrw|uwuwuuu|bbrru|rgg|urub|gbw|rwgurbwg|rrg|wuwu|uuw|bwur|uurur|wbu|gwguwgr|ggub|rrr|wubb|wbbg|grb|rbwgrr|wbbrguw|ubww|uuwg|ugwrb|grgbgrgg|bgwr|bbuugu|wbb|rurbrrb|wgwgbbr|rgurru|brgwwg|buu|wgu|bur|wwwww|ubbguu|rbrbrbb|rggg|urw|uur|brb|gbuwu|bgrugu|grwgwwb|gbrgrr|uwbbr|brbgrb|bwwwbuub|rwrb|gu|rgrr|bgwubuw|bwwurg|bg|g|rgr|grugbr|rgb|bwb|gbugb|wwr|uruwr|gr|wbgrwww|wwrurb|rugb|rwwwww|uwub|uwrru|wgb|ubr|grg|ggwrr|gwg|rww|wbggw|wurg|bgrwrrw|urru|wuu|wuwgu|ggbgb|ubbgg|wwrrr|rbg|uurg|rgurwugb|wrwg|ubw|gwgg|rbu|bbr|wwu|bwwu|rgwbrbgu|ugrg|guw|rub|ur|rggb|wgr|bu|ggb|wbbug|grw|bwr|uwwwww|wwrwb|brrur|bwbrbur|gwgu|gwuwwru|bgb|bwg|uww|wbubwg|wgrwuw|ugw|uuurrbrw|gww|gbguuw|bbuuwu|rrrr|gwugggu|bwrguu|wgbu|uwrwuww|wuwg|uwwr|gug|bgrw|gur|bwuu|uug|rwbuguu|wwgrr|grgbrw|ub|urrwburr|bgww|rwgu|bwuwwb|gbb|rbru|gwrg|bggu|wu|ggrbu|wubu|bwwg|rbrwb|ugug|rgbrrgbu|rgrruww|wurrw|rgug|ruwrgrgw|wgwgu|guggg|uwggb|uubbru|grurr|uru|wburg|brwwbb|rgwrug|brbub|bwbw|ugrug|wrg|rgrwrugr|urwrr|wuuwr|wwb|bwu|rbw|rwbwru|gwb|rg|bgbur|wwrgugr|rwg|ubu|wgwuu|wub|rwug|bgg|bgw|brw|burrbwgu|ubwuw|r|bruuu|w|rgu|bww|bbb|uubrbbw|rbrr|wb|wwbgwrrw|wrgbwu|gwrrr|wrgubu|wuggb|rgburu|bruug|ugggwur|grbu|wguuw|wr|uuu|wubgwg|bbbuug|wgbrrbg|wwbbgw|wgugbrw|uu|buwwugwu|bgrwwgu|urr|gbubuww|wur|gub|ubbb|urwugwrg|rrgb|brwgb|rwrr|gb|wru|gggu|rbgg|ww|rwrgur|bubb|wrw|ubg|ugwb|rwuurrb|ugg|gubrub|ubwr|uub|rrur|rgwb|gubwu|gbwrbgb|ug|gg|wbbburb|wwubg|bwbgb|gbbwr|ubuw|rgbgbb|ggwgbbb|urbrgu|ubbuwr|ggwr|urug|rru|brg|gbu|gwr|wrggug|rgwwr|bbw|bugwgr|uubg|wbru|uwu|rbwu|bgbrrurw|wrgug|bwbbbu|rbr|www|bbww|rgbbgu|wrb|rubb|gwrbr|uwbwu|uuwr)+$/
  //return input.patterns.filter(pattern => inputPattern.test(pattern.join(''))).length
}

export function partTwo(input: Input) {
  const search = buildSearch(input)
  return sum(input.patterns.map(p => combinations(p, search, search, 0)))
}

const cache = new Map<number, number>()

function combinations(
  pattern: Color[],
  search: Node,
  currentNode: Node,
  index: number
): number {
  if (index === 0) {
    cache.clear()
  }

  if (pattern.length === index) {
    return 'valid' in currentNode ? 1 : 0
  }

  let terminals = 0
  if (currentNode.valid) {
    if (cache.has(index)) {
      terminals = cache.get(index)!
    } else {
      terminals = combinations(pattern, search, search, index)
      cache.set(index, terminals)
    }
  }

  const n =
    (pattern[index] in currentNode
      ? combinations(pattern, search, currentNode[pattern[index]]!, index + 1)
      : 0) + terminals

  return n
}

function buildSearch({ towels }: Input): Node {
  const search: Node = { prefix: '' }
  for (const towel of towels) {
    let currentNode = search
    let prefix = ''
    for (const char of towel) {
      prefix += char
      if (currentNode[char as Color] === undefined) {
        currentNode[char as Color] = {
          prefix
        }
      }
      currentNode = currentNode[char as Color]!
    }
    currentNode.valid = true
  }
  return search
}
