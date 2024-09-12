import { h, render } from 'preact'
import { HomeView } from './views/home/home.tsx'
import { NotFoundView } from './views/not-found/not-found.tsx'
import { LocationProvider, ErrorBoundary, Router, Route } from 'preact-iso';

function App() {
  return <LocationProvider>
    <ErrorBoundary>
      <Router>
        <Route path="/" component={HomeView} />
        <NotFoundView default />
      </Router>
    </ErrorBoundary>
  </LocationProvider>
}

render(<App />, document.querySelector('#root')!)
