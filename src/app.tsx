import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './firebase'
import firebase from "firebase"
import { createStore, combineReducers } from 'redux'
import { Provider, useSelector } from 'react-redux'
import {
  ReactReduxFirebaseProvider,
  firebaseReducer,
  useFirebase
} from 'react-redux-firebase'
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import { Header } from "./header"

type Content = string

const message: Content = '1'

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer
  // firestore: firestoreReducer // <- needed if using firestore
})
// Create store with reducers and initial state
const initialState = {}
const store = createStore(rootReducer, initialState)
// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users'
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch
  // createFirestoreInstance // <- needed if using firestore
}

// @ts-ignore
window.store = store

const AppView = () => {

  return (
    <div>
    </div>
  )
}

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
    <ReactReduxFirebaseProvider {...rrfProps}>
      <Router />
    </ReactReduxFirebaseProvider>
  </Provider>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
