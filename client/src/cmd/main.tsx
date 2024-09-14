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
import { MemoryDatabase } from '../platform/preact/reactive.ts'

// DI system using React context
const provider = new Map()

const db = new MemoryDatabase()
const apiService = new ApiService()
const intentsService = new IntentsService(db, apiService)
const categoryService = new CategoryService(db, intentsService)

// These will be available in the components
// State changes in the db will automatically rerender the view
provider.set(CategoryService, categoryService)
provider.set(IntentsService, intentsService)

// I only want the Target to rerender when the route changes
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
  return (
    <AppContext.Provider value={provider}>
      <Router>
        <Route path="/" component={Page(HomeView)} />
        <Route path="/category/:selectedCategory" component={Page(IntentsIdView)} />
        <Route path="/category/all" component={Page(IntentsAllView)} />
        <Route default component={Page(NotFoundView)} />
      </Router>
    </AppContext.Provider>
  )
}

render(<App />, document.querySelector('#root')!)

// Fetch resources after the initial paint
intentsService.fetchIntents()
categoryService.loadCategories()