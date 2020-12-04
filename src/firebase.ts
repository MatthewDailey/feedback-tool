import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import { firebaseConfig } from "./config/current_config"
import { combineReducers, createStore } from "redux"
import { firebaseReducer } from "react-redux-firebase"

firebase.initializeApp(firebaseConfig)

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer
  // firestore: firestoreReducer // <- needed if using firestore
})
// Create store with reducers and initial state
const initialState = {}
export const store = createStore(rootReducer, initialState)

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users'
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}
export const reactReduxFirebaseProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch
  // createFirestoreInstance // <- needed if using firestore
}

// @ts-ignore
window.store = store



