import './home.scss'
import { h } from "preact";
// @ts-expect-error
import intentsRaw from '../../../../../call_intents_challenge.txt'

const intents: Array<string> = intentsRaw.split('\n')

type Intent = {
  key: string,
}

type IntendTags = {
  key: string,
}

export function HomeView() {
  return <div class="view-home">
    <div class="raw-intents">
      {intents.map(intent => <div>{intent}</div>)}
    </div>
    <div class="categories">
      {intents.map(intent => <div>{intent}</div>)}
    </div>
  </div>
}
