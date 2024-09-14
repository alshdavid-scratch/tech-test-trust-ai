// TODO get from backend
// @ts-expect-error
import intentsRaw from '../../../../call_intents_challenge.txt'
import { ApiService } from '../api/api.ts'
import { OnChange, Collection, MemoryDatabase, Notifiable } from '../preact/reactive.ts'

export type IntentsMap = Map<string, number>
export class IntentsService implements Notifiable {
  [OnChange]: EventTarget
  #col: Collection<IntentsMap>
  #apiService: ApiService

  constructor(
    state: MemoryDatabase,
    apiService: ApiService
  ) {
    this.#col = state.createCollection('intents', new Map())
    this[OnChange] = this.#col.asEventTarget()
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
