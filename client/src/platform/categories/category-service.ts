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

  getCategorySummary(): Map<string, number> {
    const intentList: Array<[string, number]> = []
    
    for (const category in this.#inner) {
      const intents = this.getIntents(category) || new Map()
      const sum = Array.from(intents.values()).reduce((p, c) => p + c, 0)
      intentList.push([category, sum])
    }

    intentList.sort((a, b) => b[1] - a[1])

    return new Map(intentList)
  }

  getIntents(name: string): IntentsMap | undefined {
    if (name === 'all') {
      return this.#intentsService.getIntents()
    }
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