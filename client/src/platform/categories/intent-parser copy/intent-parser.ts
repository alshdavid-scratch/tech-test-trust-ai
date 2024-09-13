import * as states from './states.ts'
import * as tokens from './tokens.ts'

const stateMap = Object.fromEntries(Object.entries(states).map(([a, b]) => [b, a]))
const tokenMap = Object.fromEntries(Object.entries(tokens).map(([a, b]) => [b, a]))

import { State, ______, WORD__, CON___, OBJ___ } from './states.ts'

import { Token, subject, conj, object } from './tokens.ts'

const table = [
//  token              word   for     a
  [ ______,           ______, ______, ______ ],
  [ subject,          WORD__, CON___, CON___ ],
  [ conj,             OBJ___, CON___, CON___ ],
  [ object,           OBJ___, OBJ___, OBJ___ ],
]

const wordMap: Record<string, number> = {
  for:  CON___,
  a:    CON___,
  an:   CON___
}

export function getCellFromStateTable(row: number | undefined, col: number | undefined): number | undefined {
  if (row === undefined || col === undefined) {
    return undefined
  }
  const foundRow = table[row]
  if (foundRow === undefined) {
    return undefined
  }
  const foundCol = foundRow[col]
  if (foundCol === undefined) {
    return undefined
  }
  return foundCol
}

export function tokenize(sentence: string) {
  console.log(sentence)
  const words = sentence.split(' ')

  let state: State = WORD__
  let token: Token = subject

  const tokens: Array<any> = []
  let buffer: Array<any> = []
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    let newState = wordMap[word]

    if (!newState) {
      if (state === CON___ || state === OBJ___) {
        newState = OBJ___
      } else {
        newState = WORD__
      }
    }

    const newToken = table[newState][0]
    
    if (token !== newToken) {
      tokens.push([tokenMap[token], buffer])
      buffer = []
      token = newToken
    }

    buffer.push(word)
    state = newState
  }
  tokens.push([tokenMap[token], buffer])


  console.log('')
  for (const token of tokens) {
    console.log(JSON.stringify(token))
  }
  console.log('')

}