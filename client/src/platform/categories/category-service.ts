const KEY = 'trust-ai-categories'

// TODO persist to backend
export class CategoryService extends EventTarget {
  #inner: Record<string, string[]>

  constructor() {
    super()
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

  addTagToCategory(name: string, key: string) {
    this.#inner[name] = this.#inner[name] || []
    this.#inner[name].push(key)
    this.dispatchEvent(new Event('change'))
  }

  entries(): Array<[string, string[]]> {
    return Array.from(Object.entries(this.#inner))
  }
}