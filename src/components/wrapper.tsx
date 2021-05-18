import * as React from 'react'
import { styled } from './styled'

export const Wrapper = styled('div', {
  maxWidth: 700,
  margin: 'auto',
  paddingBottom: 80,
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
    fontSize: 14,
    fontWeight: "$heavy"
  },

  p: {
    fontSize: 14,
    fontWeight: "$medium",
    lineHeight: 1.5,
  },

  sm: {
    margin: '0px 40px',
  }
})

export const TextContainer = styled('div', {
  maxWidth: 500,
})