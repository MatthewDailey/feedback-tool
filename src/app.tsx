import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Firebase } from './firebase'
import firebase from "firebase"

const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()

type Content = string

const message: Content = 'hidy pals'


const LoginButton = () => <button onClick={() => Firebase.auth().signInWithPopup(GoogleAuthProvider)}>Log In</button>
const LogoutButton = () => <button onClick={() => Firebase.auth().signOut()}>Log out</button>

const AppView = () => {
  React.useEffect(() => Firebase.auth().onAuthStateChanged(console.log))

  return (
    <div>
      <h1>{`${message}`}</h1>
      <LoginButton />
      <br/>
      <LogoutButton />
    </div>
  )
}

ReactDOM.render(
  <AppView />,
  document.getElementById('root')
);
