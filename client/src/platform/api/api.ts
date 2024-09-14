export type IntentsGetResponse = {
  intents: Array<{ id: string, intent: string, count: number }>
}

// This service emulates the tasks of the back end
export class ApiService {
  async getIntents(): Promise<IntentsGetResponse> {
    // @ts-expect-error
    // The bundler will convert the import into a resource URL
    // This is to mock the async behavior of an api request to get the intents
    const { default: intentsUrl } = await import('../../../../call_intents_challenge.txt')
    const intentsRaw = await fetch(intentsUrl).then(r => r.text())

    // Do some post-processing on the list, 
    // this would be done on the back end
    const result = new Map<string, IntentsGetResponse['intents'][0]>()
    const intentsClean = intentsRaw.split('\n').filter((v: string) => !!v).sort()

    for (const intent of intentsClean) {
      const hash = await hashString(intent)
      const record = result.get(hash)
      if (!record) {
        result.set(hash, { id: hash, intent, count: 1 })
        continue
      }
      record.count += 1
    }

    return {
      intents: Array.from(result.values())
    }
  }

  // getCategories etc...
}

async function hashString(input: string): Promise<string> {
  const utf8 = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('sha-1', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex.substring(0, 20);
}