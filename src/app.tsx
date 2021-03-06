import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { reactReduxFirebaseProps, store } from './lib/firebase'
import { Provider, } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import { Header } from "./components/header"
import { ManagerHome } from "./pages/manager_home"
import { ShowIfSignedIn } from "./lib/auth"
import { Participant } from "./pages/participant"
import { NewSession } from "./pages/new_session"
import { ExistingSession } from "./pages/existing_session"
import { Landing } from "./pages/landing"

const RedirectTo = (props: { route: string }) => {
  const history = useHistory()
  React.useEffect(() => history.push(props.route))
  return null
}

const Router = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/new-session">
        <ShowIfSignedIn signedIn={<NewSession />} signedOut={<RedirectTo route="/" />} />
      </Route>
      <Route path="/participant/:feedbackSessionRequestId">
        <Participant />
      </Route>
      <Route path="/session/:sessionId">
        <ShowIfSignedIn signedIn={<ExistingSession />} signedOut={<RedirectTo route="/" />} />
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
