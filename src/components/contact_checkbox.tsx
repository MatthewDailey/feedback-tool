import * as React from 'react'
import { Spacer } from "./spacer"
import { Contact } from "../lib/models"
import { styled } from './styled'

const CheckboxWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
})

export const ContactCheckbox = (props: {key?: string, isChecked: boolean, contact: Contact, onChanged: (checked: boolean) => void }) => {
  const label = `${props.contact.name} (${props.contact.email})`
  return (
    <CheckboxWrapper>
      <input
        type="checkbox"
        onChange={() => props.onChanged(!props.isChecked)}
        checked={props.isChecked}
      />
      <Spacer multiple={1} direction="x" />
      <label>{label}</label>
    </CheckboxWrapper>
  )
}