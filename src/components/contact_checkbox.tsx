import * as React from 'react'
import { Spacer } from "./spacer"
import { Contact } from "../lib/models"
import { colors, styled } from './styled'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from '@radix-ui/react-icons'

const CheckboxWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
})

const StyledCheckbox = styled(Checkbox.Root, {
  appearance: 'none',
  backgroundColor: 'transparent',
  border: 'none',
  padding: 0,
  boxShadow: 'inset 0 0 0 1px $dark',
  width: 15,
  height: 15,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 10,
  '&:focus': {
    outline: 'none',
    boxShadow: 'inset 0 0 0 1px $teal',
  },
  '&:hover': {
    cursor: 'pointer'
  }
});

export const ContactCheckbox = (props: {key?: string, isChecked: boolean, contact: Contact, onChanged: (checked: boolean) => void }) => {
  const label = `${props.contact.name} (${props.contact.email})`
  return (
    <CheckboxWrapper>
      <StyledCheckbox
        checked={props.isChecked}
        onCheckedChange={() => props.onChanged(!props.isChecked)}
      >
        <Checkbox.Indicator>
          {props.isChecked && <CheckIcon color={colors.$dark} />}
        </Checkbox.Indicator>
      </StyledCheckbox>
      <Spacer multiple={1} direction="x" />
      <label>{label}</label>
    </CheckboxWrapper>
  )
}