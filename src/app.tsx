import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { reactReduxFirebaseProps, store } from './lib/firebase'
import { Provider, } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import { Header } from "./components/header"
import { ManagerHome } from "./pages/manager_home"
import { ShowIfSignedIn } from "./lib/auth"
import { Participant } from "./pages/participant"
import { NewSession } from "./pages/new_session"
import { ExistingSession } from "./pages/existing_session"
import { Landing } from "./pages/landing"

const Router = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/new-session">
        <ShowIfSignedIn signedIn={<NewSession />} signedOut={null} />
      </Route>
      <Route path="/participant/:feedbackSessionRequestId">
        <Participant />
      </Route>
      <Route path="/session/:sessionId">
        <ShowIfSignedIn signedIn={<ExistingSession />} signedOut={null} />
      </Route>
      <Route path="/">
        <ShowIfSignedIn signedIn={<ManagerHome />} signedOut={<Landing />} />
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
