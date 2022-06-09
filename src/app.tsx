import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { reactReduxFirebaseProps, store } from './lib/firebase'
import { Provider, } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { BrowserRouter, Route, Switch, useHistory, } from "react-router-dom"
import { Header } from "./components/header"
import { ManagerHome } from "./pages/manager_home"
import { ShowIfSignedIn } from "./lib/auth"
import { Participant } from "./pages/participant"
import { ExistingSession } from "./pages/existing_session"
import { Landing } from "./pages/landing"
import { NewSessionFromCsv } from "./pages/new_session_from_csv"
import { NewSessionFromContacts } from "./pages/new_session_from_contacts"

const RedirectTo = (props: { route: string }) => {
  const history = useHistory()
  React.useEffect(() => history.push(props.route))
  return null
}

const Router = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/new-session-contacts">
        <ShowIfSignedIn signedIn={<NewSessionFromContacts />} signedOut={<RedirectTo route="/" />} />
      </Route>
      <Route path="/new-session">
        <ShowIfSignedIn signedIn={<NewSessionFromCsv />} signedOut={<RedirectTo route="/" />} />
      </Route>
      <Route path="/participant/:feedbackSessionRequestId">
        <Participant />
      </Route>
      <Route path="/session/:sessionId">
        <ExistingSession />
      </Route>
      <Route path="/app">
        <ShowIfSignedIn signedIn={<ManagerHome />} signedOut={<RedirectTo route="/" />} />
      </Route>
      <Route path="/">
        <Landing />
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
