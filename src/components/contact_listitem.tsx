import * as React from 'react'
import { Spacer } from "./spacer"
import { Contact } from "../lib/models"
import { colors, styled } from './styled'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
})

export const ContactListItem = (props: {key?: string, contact: Contact}) => {
  const label = `${props.contact.name} (${props.contact.email}, ${props.contact.team}, ${props.contact.role})`
  return (
    <Wrapper>
      <label>{label}</label>
    </Wrapper>
  )
}