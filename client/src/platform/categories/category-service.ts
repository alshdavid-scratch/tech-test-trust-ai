import { IntentsMap, IntentsService } from "../intents/intents-service.ts"
import { ChangeNotifier, Notifiable, OnChange } from "../preact/reactive.ts"

const KEY = 'trust-ai-categories'

// TODO persist to backend
export class CategoryService implements Notifiable {
  [OnChange]: ChangeNotifier
  #inner: Record<string, string[]>
  #intentsService: IntentsService

  constructor(
    intentsService: IntentsService
  ) {
    this[OnChange] = new ChangeNotifier()
    this.#intentsService = intentsService
    const stored = window.localStorage.getItem(KEY)
    if (stored) {
      this.#inner = JSON.parse(stored)
    } else {
      this.#inner = {}
    }    
  }

  newCategory(categoryName: string) {
    this.#inner[categoryName] = []
    window.localStorage.setItem(KEY, JSON.stringify(this.#inner))
    this[OnChange].notify()
  }

  removeCategory(categoryName: string) {
    delete this.#inner[categoryName]
    window.localStorage.setItem(KEY, JSON.stringify(this.#inner))
    this[OnChange].notify()
  }

  addIntent(categoryName: string, intent: string) {
    this.#inner[categoryName] = this.#inner[categoryName] || []
    this.#inner[categoryName].push(intent)
    window.localStorage.setItem(KEY, JSON.stringify(this.#inner))
    this[OnChange].notify()
  }

  removeIntent(categoryName: string, intent: string) {
    this.#inner[categoryName] = this.#inner[categoryName] || []
    this.#inner[categoryName] = this.#inner[categoryName].filter(n => n !== intent)
    window.localStorage.setItem(KEY, JSON.stringify(this.#inner))
    this[OnChange].notify()
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

  getIntents(categoryName: string): IntentsMap | undefined {
    if (categoryName === 'all') {
      return this.#intentsService.getIntents()
    }
    const intents = this.#inner[categoryName]
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