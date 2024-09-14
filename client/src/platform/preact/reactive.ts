export const OnChange = Symbol('Reactive')

export interface Notifiable {
  [OnChange]: EventTarget
}

export class MemoryDatabase {
  collections: Map<string, Collection<any>>

  constructor() {
    this.collections = new Map()
  }

  createCollection<T>(name: string, initialState: any = {}): Collection<T> {
    if (this.collections.has(name)) {
      throw new Error('collection exists')
    }
    const col = new Collection(initialState)
    this.collections.set(name, col)
    return col
  }

  getCollection<T = unknown>(name: string): Collection<T> {
    const col = this.collections.get(name)
    if (!col) {
      throw new Error('collection does not created')
    }
    return col
  }
}

export class Collection<T> extends EventTarget {
  collection: T

  constructor(collection: T) {
    super()
    this.collection = collection
  }

  update<R>(draftFn: (state: T) => Promise<R>): Promise<R>
  update<R>(draftFn: (state: T) => R): R 
  update<R>(draftFn: (state: T) => R | Promise<R>): R | Promise<R> {
    return (async () => {
      const result = await draftFn(this.collection)
      this.dispatchEvent(new Event('change'))
      return result
    })()
  }

  get(): T {
    return this.collection
  }

  asEventTarget(): EventTarget {
    return this
  }
}