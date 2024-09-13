import { IntentsMap, IntentsService } from "../intents/intents-service.ts"
import { calculateDistance } from "./calculate-distance.ts"
import { tokenize } from "./intent-parser/intent-parser.ts"

const KEY = 'trust-ai-categories'

export class IntentDistanceGraph {
  #al: Map<string, Map<string, number>>

  constructor() {
    this.#al = new Map()
  }

  addNode(intent: string) {
    this.#al.set(intent, new Map())
  }

  addEdge(source: string, dest: string) {
    if (this.#al.get(source)?.has(dest) || source === dest) {
      return
    }
    const diff = calculateDistance(source, dest)
    this.#al.get(source)?.set(dest, diff)
    this.#al.get(dest)?.set(source, diff)
  }

  getEdges(intent: string) { 
    return this.#al.get(intent) 
  }
}


// TODO persist to backend
export class CategoryService extends EventTarget {
  #inner: Record<string, string[]>
  #inferred: Record<string, string[]>
  #intentsService: IntentsService
  #distance: IntentDistanceGraph

  constructor(
    intentsService: IntentsService
  ) {
    super()
    this.#intentsService = intentsService
    this.#distance = new IntentDistanceGraph

    const stored = window.localStorage.getItem(KEY)
    if (stored) {
      this.#inner = JSON.parse(stored)
    } else {
      this.#inner = {}
    }
    this.#inferred = {}
    this.#inferCategories()
  }

  #inferCategories() {
    const intents = this.#intentsService.getIntents()

    console.log(tokenize(Array.from(intents.keys())[6]))
    tokenize(Array.from(intents.keys())[4])

    // for (const intent of intents.keys()) {
    //   console.log(tokenize(intent))
    // }
    // for (const intent of intents.keys()) {
    //   this.#distance.addNode(intent)
    // }

    // for (const intent of intents.keys()) {
    //   for (const other of intents.keys()) {
    //     if (intent === other) continue
    //     this.#distance.addEdge(intent, other)
    //   }
    // }

    // window.debug = this.#distance
    // console.log(this.#distance)
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

    for (const category in this.#inferred) {
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

    const intentMap = new Map()

    ;(() => {
      const intents = this.#inner[name]
      if (!intents) {
        return undefined
      }

      const allIntents = this.#intentsService.getIntents()
      for (const intent of intents) {
        intentMap.set(intent, allIntents.get(intent) || 0)
      }
    })()

    ;(() => {
      const intents = this.#inferred[name]
      if (!intents) {
        return undefined
      }
      const allIntents = this.#intentsService.getIntents()
      for (const intent of intents) {
        intentMap.set(intent, allIntents.get(intent) || 0)
      }
    })()

    return intentMap
  }

  entries(): Array<[string, string[]]> {
    return Array.from(Object.entries(this.#inner))
  }

  inferredEntries(): Array<[string, string[]]> {
    return Array.from(Object.entries(this.#inferred))
  }
}
