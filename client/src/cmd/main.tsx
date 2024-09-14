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
import { ApiService } from '../platform/api/api.ts'

const services = new Map()

const apiService = new ApiService()
const intentsService = new IntentsService(apiService)
const categoryService = new CategoryService(intentsService)

intentsService.fetchIntents()

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
