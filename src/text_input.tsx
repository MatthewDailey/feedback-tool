import * as React from 'react'


export const TextInput = (props: {
  label?: string,
  hint?: string,
  value: string|undefined,
  onChange: (val: string) => void,
  size: 'large'|'small'
}) => {
  const inputId = `${props.label}-input`
  return (
    <div className={`${props.size} TextInput`}>
      {props.label && <label htmlFor={inputId}>{props.label}</label>}
      <input
        id={inputId}
        type="text"
        value={props.value}
        placeholder={props.hint}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  )
}