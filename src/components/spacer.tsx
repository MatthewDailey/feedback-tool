import * as React from 'react'

export const Spacer = (props: { multiple: number, direction: 'x'|'y', key?: string }) => (
  <div style={props.direction === 'x' ? { width: 8 * props.multiple } : { height: 8 * props.multiple }}/>
)