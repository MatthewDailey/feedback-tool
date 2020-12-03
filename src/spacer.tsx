import * as React from 'react'

export const Spacer = (props: { multiple: number, direction: 'x'|'y'}) => (
  <div style={props.direction === 'x' ? { width: 8 * props.multiple } : { height: 8 * props.multiple }}/>
)