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
import { ManagerHome, NewSession, ExistingSession } from "./manager_home"
import { ShowIfSignedIn } from "./auth"
import { Participant } from "./participant"

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
        <ShowIfSignedIn signedIn={<ManagerHome />} signedOut={null} />
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
