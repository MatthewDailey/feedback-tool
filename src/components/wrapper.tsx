import * as React from 'react'
import { styled } from './styled'

export const Wrapper = styled('div', {
  maxWidth: 800,
  margin: 'auto',
  marginBottom: 80,
  color: "$dark",

  h1: {
    fontSize: 40,
    fontWeight: "$heavy"
  },

  h2: {
    fontSize: 24,
    fontWeight: '$heavy',
  },

  h3: {
    fontSize: 12,
    fontWeight: "$heavy"
  },

  p: {
    fontSize: 12,
    fontWeight: "$medium",
  },

  sm: {
    margin: '0px 40px',
  }
})