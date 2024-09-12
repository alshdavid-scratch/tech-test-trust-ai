import './index.scss'
import { h, render, Fragment } from 'preact'
import { AppContext } from './contexts/app.tsx'
import { HomeView } from './views/home/home.tsx'
import { NotFoundView } from './views/not-found/not-found.tsx'
import { LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso';
import { Header } from './components/header/header.tsx';
import { CategoryService } from '../platform/categories/category-service.ts'
import { IntentsService } from '../platform/intents/intents-service.ts'

const services = new Map()

const intentsService = new IntentsService()
const categoryService = new CategoryService(intentsService)

services.set(CategoryService, categoryService)
services.set(IntentsService, intentsService)

function App() {
  return <Fragment>
    <AppContext.Provider value={services}>
      <LocationProvider>
        <ErrorBoundary>
          <Header />
          <Router>
            <Route path="/" component={HomeView} />
            <NotFoundView default />
          </Router>
        </ErrorBoundary>
      </LocationProvider>
    </AppContext.Provider>
  </Fragment>
}

render(<App />, document.querySelector('#root')!)
