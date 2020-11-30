import firebase from "firebase/app"
import "firebase/auth"
import { firebaseConfig } from "./firebase_config_dev"

export const Firebase = firebase.initializeApp(firebaseConfig)