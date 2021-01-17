import * as React from 'react'
import { styled } from './styled'

export const Link = styled('a', {
  color: '$teal',

  '&:hover': {
    cursor: 'pointer',
    textDecoration: 'underline',
  }
})

export const Button = styled('button', {
  backgroundColor: '$seafoam',
  border: '$borderWidth solid $seafoam',
  color: '$dark',

  "&:enabled:hover": {
    cursor: 'pointer',
    border: '$borderWidth solid $dark',
  },
  "&:enabled:focus": {
    border: '$borderWidth solid $dark'
  },
  "&:enabled:active": {
    border: '$borderWidth) solid $dark',
    backgroundColor: '$dark',
    color: '$light',
  },
  "&:disabled": {
    opacity: 0.5,
  }
})