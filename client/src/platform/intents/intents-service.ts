// TODO get from backend
// @ts-expect-error
import intentsRaw from '../../../../call_intents_challenge.txt'

export type Intents = string[]

export class IntentsService extends EventTarget {
  #intents: string[]

  constructor() {
    super()
    const intents = intentsRaw.split('\n').filter((v: string) => !!v).sort()
    this.#intents = Array.from(new Set(intents))
  }

  getIntents(): string[] {
    return this.#intents
  }
}
