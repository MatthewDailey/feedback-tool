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
  },

  variants: {
    buttonSize: {
      small: {
        height: 24,
        borderRadius: 4,
        padding: '4px 8px',
      },
      large: {
        height: 36,
        paddingLeft: 22,
        paddingRight: 22,
        borderRadius: 8,
      },
    }
  }
})

export const SignUpButton = styled('button', {
  backgroundColor: '$peach',
  border: '$borderWidth solid $peach',
  color: '$dark',
  fontWeight: "$heavy",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",

  "&:enabled:hover": {
    cursor: 'pointer',
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
  },

  padding: 16,
  borderRadius: 8,
})