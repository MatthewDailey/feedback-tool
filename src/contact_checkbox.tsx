import * as React from 'react'
import { Spacer } from "./components/spacer"
import { Contact } from "./models"

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