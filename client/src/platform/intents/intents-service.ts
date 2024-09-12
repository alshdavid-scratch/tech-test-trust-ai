// TODO get from backend
// @ts-expect-error
import intentsRaw from '../../../../call_intents_challenge.txt'

export type Intents = string[]

export class IntentsService extends EventTarget {
  // tag name => intent[]
  #tagIndex: Record<string, Record<string, boolean>>
  #intents: string[]

  constructor() {
    super()
    this.#intents = intentsRaw.split('\n')
    this.#tagIndex = {}
  }

  getIntents(): string[] {
    return this.#intents
  }

  getIntentsForTags(...tags: string[]): string[] {
    const output = new Set<string>
    
    for (const tag of tags) {
      const intents = this.#tagIndex[tag]
      if (!intents) {
        continue
      }
    }

    return Array.from(output)
  }

  addTag(intent: string, tag: string) {
    this.#tagIndex[tag] = this.#tagIndex[tag] || {}
    this.#tagIndex[tag][intent] = true
    this.dispatchEvent(new Event('change'))
  }

  removeTag(intent: string, tag: string) {
    this.#tagIndex[tag] = this.#tagIndex[tag] || {}
    delete this.#tagIndex[tag][intent]
    this.dispatchEvent(new Event('change'))
  }
}
