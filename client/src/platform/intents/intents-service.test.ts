import * as assert from 'node:assert'
import test, { beforeEach, describe } from 'node:test'
import { IntentsService } from './intents-service.ts'
import { mockInterface, MockedInterface } from '../testing/dynamic-mock.ts'
import { ApiService, IntentsGetResponse } from '../api/api.ts'
import { Database } from '../preact/reactive.ts'

describe('IntentsService', () => {
  let apiService: MockedInterface<ApiService>
  let db: Database

  beforeEach(() => {
    db = new Database()
    apiService = mockInterface()

    const response: IntentsGetResponse = { intents: [{ id: '1', intent: 'intent', count: 1 }] }
    apiService.getIntents.mock.mockImplementation(async () => response)
  })

  describe('constructor', () => {
    test('should not throw', (t) => {
      assert.doesNotThrow(() => new IntentsService(db, apiService))
    })
  })

  describe('instanceof', () => {
    let intentsService: IntentsService

    beforeEach(() => {
      intentsService = new IntentsService(db, apiService)
    })

    describe('fetchIntents', async () => {
      test('should call api to get intents', async (t) => {
        await intentsService.fetchIntents()
        assert.equal(apiService.getIntents.mock.callCount(), 1)
      })
    })

    describe('getIntents', async () => {
      test('should return intents', async (t) => {
        await intentsService.fetchIntents()
        const result = intentsService.getIntents()
        const entries = Array.from(result.entries())
        assert.equal(entries.length, 1)
        assert.equal(entries[0][0], 'intent')
        assert.equal(entries[0][1], 1)
      })
    })
  })
})
