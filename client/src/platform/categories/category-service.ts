import { IntentsMap, IntentsService } from "../intents/intents-service.ts"

const KEY = 'trust-ai-categories'

// TODO persist to backend
export class CategoryService extends EventTarget {
  #inner: Record<string, string[]>
  #intentsService: IntentsService

  constructor(
    intentsService: IntentsService
  ) {
    super()
    this.#intentsService = intentsService
    const stored = window.localStorage.getItem(KEY)
    if (stored) {
      this.#inner = JSON.parse(stored)
    } else {
      this.#inner = {}
    }
  }

  newCategory(name: string) {
    this.#inner[name] = []
    window.localStorage.setItem(KEY, JSON.stringify(this.#inner))
    this.dispatchEvent(new Event('change'))
  }

  removeCategory(name: string) {
    delete this.#inner[name]
    window.localStorage.setItem(KEY, JSON.stringify(this.#inner))
    this.dispatchEvent(new Event('change'))
  }

  addIntent(name: string, key: string) {
    this.#inner[name] = this.#inner[name] || []
    this.#inner[name].push(key)
    window.localStorage.setItem(KEY, JSON.stringify(this.#inner))
    this.dispatchEvent(new Event('change'))
  }

  removeIntent(name: string, key: string) {
    this.#inner[name] = this.#inner[name] || []
    this.#inner[name] = this.#inner[name].filter(n => n !== key)
    window.localStorage.setItem(KEY, JSON.stringify(this.#inner))
    this.dispatchEvent(new Event('change'))
  }

  getIntents(name: string): IntentsMap | undefined {
    const intents = this.#inner[name]
    if (!intents) {
      return undefined
    }
    const intentMap: IntentsMap = new Map()

    const allIntents = this.#intentsService.getIntents()
    for (const intent of intents) {
      intentMap.set(intent, allIntents.get(intent) || 0)
    }

    return intentMap
  }

  entries(): Array<[string, string[]]> {
    return Array.from(Object.entries(this.#inner))
  }
}