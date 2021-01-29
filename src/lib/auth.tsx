import * as React from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirebaseConnect } from "react-redux-firebase"
import { User } from "./models"
import { firebaseConfig } from "../config/current_config"

declare var gapi: any;

export function loadGoogleClient() {
  gapi.load('client:auth2', () => {
    console.log('loaded google client')

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    gapi.client.init({
      apiKey: firebaseConfig.apiKey,
      clientId: firebaseConfig.clientId,
      discoveryDocs: DISCOVERY_DOCS,
      scope : SCOPES,
    }).then(function() {
      const GoogleAuth = gapi.auth2.getAuthInstance();
      GoogleAuth.isSignedIn.listen((data) => {
        gapi.client.request({
          'path': 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        }).then(function(response) {
          console.log(response.result);
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        })
      });

      GoogleAuth.signIn()
    });

  })
}

// Manually get calendar access. Note API was only enabled in dev so will need to enable in prod if want to provide.
// window.calRequest = loadGoogleClient

export const useUser = (): User|null => {
  const profile = useSelector(state => state.firebase.auth)
  useFirebaseConnect([
    { path: `users/${profile.uid}` }
  ])
  const users = useSelector(state => state.firebase.data.users)
  if (!isLoaded(users)) {
    return null
  }
  return { uid: profile.uid, ...users[profile.uid] }
}

export const ShowIfSignedIn = (props: { signedIn: React.ReactElement|null, signedOut: React.ReactElement|null }) => {
  const profile = useSelector(state => state.firebase.auth)

  if (!profile.isLoaded) {
    return null
  }

  if (profile.isEmpty) {
    return props.signedOut
  }

  return props.signedIn
}

