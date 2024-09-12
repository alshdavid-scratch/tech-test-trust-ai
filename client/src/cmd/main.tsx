import './index.scss'
import { h, render, Fragment } from 'preact'
import { HomeView } from './views/home/home.tsx'
import { NotFoundView } from './views/not-found/not-found.tsx'
import { LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso';
import { Header } from './components/header/header.tsx';

function App() {
  return <Fragment>
    <LocationProvider>
      <ErrorBoundary>
        <Header />
        <Router>
          <Route path="/" component={HomeView} />
          <NotFoundView default />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  </Fragment>
}

render(<App />, document.querySelector('#root')!)
