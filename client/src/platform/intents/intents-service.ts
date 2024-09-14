// TODO get from backend
// @ts-expect-error
import intentsRaw from '../../../../call_intents_challenge.txt'
import { ApiService } from '../api/api.ts'
import { ChangeNotifier, Notifiable, OnChange } from '../preact/reactive.ts'

export type IntentsMap = Map<string, number>

export class IntentsService implements Notifiable {
  [OnChange]: ChangeNotifier
  #intents: Map<string, number>
  #apiService: ApiService

  constructor(
    apiService: ApiService
  ) {
    this[OnChange] = new ChangeNotifier()
    this.#apiService = apiService
    this.#intents = new Map()
  }

  async fetchIntents(): Promise<void> {
    const response = await this.#apiService.getIntents()
    for (const record of response.intents) {
      this.#intents.set(record.intent, record.count)
    }
    this[OnChange].notify()
  }

  getIntents(): Map<string, number> {
    return this.#intents
  }
}
