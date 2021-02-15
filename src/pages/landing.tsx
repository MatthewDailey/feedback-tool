import * as React from 'react'
import { Wrapper } from "../components/wrapper"
import { Spacer } from "../components/spacer"
import { PrimaryCta } from "../components/ctas"
import { ShowIfSignedIn, useLogin, useUser } from "../lib/auth"
import { useHistory } from 'react-router-dom'

const GoogleSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.4883 6.54545H8.17821V9.63636H12.386C11.9937 11.6 10.3534 12.7273 8.17821 12.7273C5.61077 12.7273 3.54255 10.6182 3.54255 8C3.54255 5.38182 5.61077 3.27273 8.17821 3.27273C9.28364 3.27273 10.2821 3.67273 11.0666 4.32727L13.3488 2C11.9581 0.763636 10.1751 0 8.17821 0C3.82783 0 0.333252 3.56364 0.333252 8C0.333252 12.4364 3.82783 16 8.17821 16C12.1007 16 15.6666 13.0909 15.6666 8C15.6666 7.52727 15.5953 7.01818 15.4883 6.54545Z"
      fill="currentColor" />
  </svg>
)

const SignUp = () => {
  const login = useLogin()
  return (
    <PrimaryCta onClick={login}>
      <GoogleSvg />
      <Spacer multiple={1} direction="x" />
      Sign up with Google
    </PrimaryCta>
  )
}

const GoToApp = () => {
  const history = useHistory()
  const user = useUser()
  const buttonText = user ? `Enter the app as ${user.displayName}` : 'Enter the app'
  return (
    <PrimaryCta onClick={() => history.push('/app')}>
      <GoogleSvg />
      <Spacer multiple={1} direction="x" />
      {buttonText}
    </PrimaryCta>
  )
}


export const Landing = () => {
  return (
    <Wrapper>
      <Spacer direction="y" multiple={3} />

      <h1>Help your team give each other the gift of feedback.</h1>

      <Spacer direction="y" multiple={3} />

      <p>Feedback.Gifts is a tool for a manager to run 360° feedback sessions. It automates the process of setting up
        opt-in to direct feedback conversations between teammates.</p>

      <Spacer direction="y" multiple={3} />

      <ShowIfSignedIn signedIn={<GoToApp />} signedOut={<SignUp />} loading={<SignUp />} />

      <Spacer direction="y" multiple={5} />

      <h2>What is this and why does it exist?</h2>

      <Spacer direction="y" multiple={1} />

      <p>Feedback Gifts is an add-on to support a standard performance review process. Some times a performance review
        is done by having team members submit 360 feedback about each other and then the manager is responsible for
        synthesizing, anonymizing and delivering that feedback.</p>

      <Spacer direction="y" multiple={2} />

      <b>What's wrong with a manager delivering anonymized feedback?</b>
      <Spacer direction="y" multiple={1} />
      <p>The process of making feedback anonymous removes details and for feedback to be effective it needs to be
        specific. That means details! Another downside to this approach is that it misses the opportunity for a team to
        grow closer by working through tough situations together openly and also by praising each other directly.</p>

      <Spacer direction="y" multiple={2} />

      <b>What's good about anonymized feedback?</b>
      <Spacer direction="y" multiple={1} />
      <p>Anonymizing feedback can help team members feel comfortable speaking freely. The idea is hard topics are more
        likely to be brought up rather than swept under the rug. Another benefit of the manager delivering all the
        feedback is that it saves a ton of time on everyone's calendars.</p>

      <Spacer direction="y" multiple={2} />

      <b>Is there a happy medium?</b>
      <Spacer direction="y" multiple={1} />
      <p>This is where Feedback.Gifts comes in. It allows team members to opt-in to a direct feedback discussion. The
        choice to opt-in to a conversation is critical because it allows people to form closer bonds by opting in to
        potentially tough conversation while also allowing people to protect their calendars and have managers handle
        conversation they aren't ready to handle directly.</p>

      <Spacer direction="y" multiple={5} />

      <h2>What are the steps to running a feedback session?</h2>

      <Spacer direction="y" multiple={2} />

      <b>Step 1</b>
      <Spacer direction="y" multiple={1} />
      <p>The manager creates a new feedback session and chooses teammates to invite.</p>

      <Spacer direction="y" multiple={2} />

      <b>Step 2</b>
      <Spacer direction="y" multiple={1} />
      <p>The participants in the session are sent an email with a personal url that allows them to choose which other
        participants they would like to have direct feedback conversations with.</p>

      <Spacer direction="y" multiple={2} />

      <b>Step 3</b>
      <Spacer direction="y" multiple={1} />
      <p>The manager finalizes the session and all participants are sent an email with their matches. They are
        instructed to set up a 30 min feedback conversation with each match to deliver their feedback. Each match
        results in two 30 min conversations so each participant has a chance to hear feedback.</p>

      <Spacer direction="y" multiple={5} />

      <h2>When should I run a feedback session?</h2>

      <Spacer direction="y" multiple={1} />

      <p>Whenever you want! Although, this tool's intended use is to be run during a 360 performance review cycle after
        participants have submitted feedback about each other and before the manager has had the final performance
        conversation.</p>

    </Wrapper>
  )
}