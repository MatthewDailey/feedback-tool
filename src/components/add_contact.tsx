import * as React from 'react'
import { styled } from "./styled"
import { useFirebase } from "react-redux-firebase"
import { useUser } from "../lib/auth"
import { TextInput } from "./text_input"
import { Spacer } from "./spacer"
import { Button } from "./ctas"

function isEmail(email: string): boolean {
  const re1 = /^[^<>\/\\:?*"|]*$/
  const re2 = /^[\u0000-\u007F]+$/
  const re3 = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i
  return re1.test(email) && re2.test(email) && re3.test(email)
}

const AddContactWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'end',
  flexWrap: "wrap",
})

export const AddContact = (props: { onNewContact?: (contactKey : string) => void }) => {
  const firebase = useFirebase()
  const user = useUser()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')

  if (!user) { return null }

  const addContact = () => {
    if (name && email) {
      firebase.push(`users/${user.uid}/contacts`, { name, email })
        .then((result) => {
          if (props.onNewContact && result.key) {
            props.onNewContact(result.key)
          }

          setName('')
          setEmail('')
        })
        .catch((e) => console.error('Failed to add contact', e))
    }
  }

  const inputsAreValid = isEmail(email) && name

  return (
    <AddContactWrapper>
      <TextInput size="small" label="Name" hint="John Doe" value={name} onChange={(v) => setName(v)}/>
      <Spacer multiple={1} direction="x" />
      <TextInput size="small" label="Email" hint="John@figma.com" value={email} onChange={(e) => setEmail(e)}/>
      <Spacer multiple={1} direction="x" />
      <Button buttonSize="small" onClick={addContact} disabled={!inputsAreValid}>Add Contact</Button>
    </AddContactWrapper>
  )
}