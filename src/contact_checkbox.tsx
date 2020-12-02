import * as React from 'react'
import { Contact } from "./auth"

export const ContactCheckbox = (props: {key: string, isChecked: boolean, contact: Contact, onChanged: (checked: boolean) => void }) => {
  const label = `${props.contact.name} (${props.contact.email})`
  return (
    <div>
      <input type="checkbox" onChange={(e) => props.onChanged(e.target.value)}/>
      <span>{label}</span>
    </div>
  )
}