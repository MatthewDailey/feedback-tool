import * as React from 'react'
import { styled } from './styled'

const StyledInput = styled('input', {
  border: '1px solid $dark',

  '&:focus': {
    boxShadow: '0 0 0 1px $teal',
    border: '1px solid $teal',
  },

  borderRadius: '8px',
  padding: '12px 16px',
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

async function parseCsvFile<T>(files: FileList|null): Promise<T[]> {
  if (!files) {
    return []
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('error', (e) => {
      reject(e)
    })
    reader.addEventListener('load', (e) => {
      console.log("RESULT", reader.result)
      resolve([])
    })
    reader.readAsText(files[0])
  })
}

export function CsvFileInput<T>(props: {
  label?: string,
  hint?: string,
  onChange: (val: T[]) => void,
}) {
  const inputId = `${props.label}-input`
  return (
    <Container>
      {props.label && <Label htmlFor={inputId}>{props.label}</Label>}
      <StyledInput
        id={inputId}
        type={"file"}
        placeholder={props.hint}
        onChange={(e) => parseCsvFile<T>(e.target.files)
          .then((values => props.onChange(values)))
          .catch(console.error)}
        accept={".csv"}
      />
    </Container>
  )
}

