import * as React from 'react'


export const TextInput = (props: {
  label?: string,
  hint?: string,
  value: string|null,
  onChange: (val: string) => void,
  size: 'large'|'small'
}) => {
  return (
    <div className={`${props.size} TextInput`}>
      {props.label && <p>{props.label}</p>}
      <input
        type="text"
        value={props.value}
        placeholder={props.hint}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  )
}