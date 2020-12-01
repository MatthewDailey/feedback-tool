import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { reactReduxFirebaseProps, store } from './firebase'
import { Provider, } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import { Header } from "./header"

const AppView = () => {

  return (
    <div>
    </div>
  )
}

// TODO: See useParams() for providing a feedback session id to a view https://reactrouter.com/web/guides/quick-start

const Router = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/1">
        <h2>1</h2>
      </Route>
      <Route path="/2">
        <h2>2</h2>
      </Route>
      <Route path="/">
        <AppView />
      </Route>
    </Switch>
  </BrowserRouter>
)

const App = () => (
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...reactReduxFirebaseProps}>
      <Router />
    </ReactReduxFirebaseProvider>
  </Provider>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
