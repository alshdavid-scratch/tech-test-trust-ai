import nlp from 'compromise'
import './index.scss'
import { h, render, Fragment } from 'preact'
import { AppContext } from './contexts/app.tsx'
import { HomeView } from './views/home/home.tsx'
import { NotFoundView } from './views/not-found/not-found.tsx'
import { IntentsIdView } from './views/intents-id/intents-id.tsx'
import { Router, Route } from 'preact-router';
import { Header } from './components/header/header.tsx';
import { CategoryService } from '../platform/categories/category-service.ts'
import { IntentsService } from '../platform/intents/intents-service.ts'
import { Sidebar } from './components/sidebar/sidebar.tsx'
import { IntentsAllView } from './views/intents-all/intents-all.tsx'
import Three from 'compromise/view/three'

const services = new Map()

const intentsService = new IntentsService()
const categoryService = new CategoryService(intentsService)

services.set(CategoryService, categoryService)
services.set(IntentsService, intentsService)

function Page(Target: any) {
  return () => <Fragment>
    <Header />
    <main>
      <Sidebar />
      <Target/>
    </main>
  </Fragment>
}

function App() {
  return <Fragment>
    <AppContext.Provider value={services}>
      <Router>
        <Route path="/" component={Page(HomeView)} />
        <Route path="/category/:selectedCategory" component={Page(IntentsIdView)} />
        <Route path="/category/all" component={Page(IntentsAllView)} />
        <Route default component={Page(NotFoundView)} />
      </Router>
    </AppContext.Provider>
  </Fragment>
}

render(<App />, document.querySelector('#root')!)


// let doc = nlp('Acquire a facsimile of old receipts')
// console.log(doc.verbs())
// console.log(doc.text())


const intents: Three[] = []
const categories: Record<string, string[]> = {}

for (const [intent] of intentsService.getIntents()) {
  intents.push(nlp(intent))
}

let i = 0
main: for (const intent of intents) {
  i++
  if (i === 10) break
  console.log(intent.nouns().json())
  // for (const [category, inner] of Object.entries(categories)) {
  //   console.table([intent.text(), category, intent.match(nlp(category)).json().length, intent.match(nlp(category)).json()])
  //   if (intent.match(nlp(category)).json().length === 0) {
  //     inner.push(intent.text())
  //     continue main
  //   }
  // }
  // categories[intent.text()] = []
}

console.log(categories)

// ;(() => {

//   console.log(intents[0].normalize().text())
//   // for (const intent of intents) {
//   //   for (const intent2 of intents) {
//   //     console.log(intent.difference(intent2).json())
//   //   }

//   //   // console.log(doc.verbs().json())
//   //   // console.log(doc.nouns().json())
//   //   console.log('')
//   // }
// })()