import * as React from 'react'
import { styled } from "./styled"
import { useFirebase } from "react-redux-firebase"
import { useUser } from "../lib/auth"
import { TextInput } from "./text_input"
import { Spacer } from "./spacer"
import { Button } from "./ctas"

const AddContactWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'end',
})

export const AddContact = () => {
  const firebase = useFirebase()
  const user = useUser()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')

  if (!user) { return null }

  const addContact = () => {
    if (name && email) {
      firebase.push(`users/${user.uid}/contacts`, { name, email })
        .then(() => {
          setName('')
          setEmail('')
        })
        .catch((e) => console.error('Failed to add contact', e))
    }
  }

  // TODO (mjd): validate inputs.

  return (
    <AddContactWrapper>
      <TextInput size="small" label="Name" hint="John Doe" value={name} onChange={(v) => setName(v)}/>
      <Spacer multiple={1} direction="x" />
      <TextInput size="small" label="Email" hint="John@figma.com" value={email} onChange={(e) => setEmail(e)}/>
      <Spacer multiple={1} direction="x" />
      <Button buttonSize="small" onClick={addContact}>Add Contact</Button>
    </AddContactWrapper>
  )
}