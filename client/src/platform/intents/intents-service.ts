// TODO get from backend
// @ts-expect-error
import intentsRaw from '../../../../call_intents_challenge.txt'

export type IntentsMap = Map<string, number>

export class IntentsService extends EventTarget {
  #intents: Map<string, number>

  constructor() {
    super()
    this.#intents = new Map()
    const intents = intentsRaw.split('\n').filter((v: string) => !!v).sort()
    for (const intent of intents) {
      const existing = this.#intents.get(intent) ?? 0
      this.#intents.set(intent, existing + 1)
    }
  }

  getIntents(): Map<string, number> {
    return this.#intents
  }
}
