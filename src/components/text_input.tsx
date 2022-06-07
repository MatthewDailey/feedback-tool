import * as React from 'react'
import { styled } from './styled'

const StyledInput = styled('input', {
  border: '1px solid $dark',

  '&:focus': {
    boxShadow: '0 0 0 1px $teal',
    border: '1px solid $teal',
  },

  variants: {
    inputSize: {
      large: {
        height: '40px',
        width: '200px',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      small: {
        height: '24px',
        borderRadius: '4px',
        padding: '4px 8px',
      },
    },
  }
})

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
})

const Label = styled('label', {
  fontSize: '8px',
  marginTop: 8,
})

export const TextInput = (props: {
  label?: string,
  hint?: string,
  value: string|undefined,
  onChange: (val: string) => void,
  size: 'large'|'small',
}) => {
  const inputId = `${props.label}-input`
  return (
    <Container>
      {props.label && <Label htmlFor={inputId}>{props.label}</Label>}
      <StyledInput
        id={inputId}
        type={"text"}
        value={props.value}
        placeholder={props.hint}
        onChange={(e) => props.onChange(e.target.value)}
        inputSize={props.size}
      />
    </Container>
  )
}

