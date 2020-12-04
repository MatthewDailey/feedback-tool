import * as React from 'react'
import { Contact } from "./auth"
import { Spacer } from "./spacer"

export const ContactCheckbox = (props: {key?: string, isChecked: boolean, contact: Contact, onChanged: (checked: boolean) => void }) => {
  const label = `${props.contact.name} (${props.contact.email})`
  return (
    <div className="contactCheckbox">
      <input
        type="checkbox"
        onChange={() => props.onChanged(!props.isChecked)}
        checked={props.isChecked}
      />
      <Spacer multiple={1} direction="x" />
      <label>{label}</label>
    </div>
  )
}