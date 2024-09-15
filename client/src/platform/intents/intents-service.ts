import { ApiService } from '../api/api.ts'
import { Subscribable, OnChange, Collection, RxDb, Notifiable } from '../preact/reactive.ts'

export type IntentsMap = Map<string, number>
export class IntentsService implements Notifiable {
  [OnChange]: Subscribable
  #col: Collection<IntentsMap>
  #apiService: ApiService

  constructor(
    state: RxDb,
    apiService: ApiService
  ) {
    this.#col = state.createCollection('intents', new Map())
    this[OnChange] = this.#col
    this.#apiService = apiService
  }

  fetchIntents(): Promise<void> {
    return this.#col.update(async (intents) => {
      const response = await this.#apiService.getIntents()
      for (const record of response.intents) {
        intents.set(record.intent, record.count)
      }
    })
  }

  getIntents(): IntentsMap {
    return this.#col.get()
  }
}
