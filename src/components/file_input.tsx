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

// Taken from https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
function CSVToArray( strData, strDelimiter = ',' ){
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches: RegExpMatchArray|null = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
    ){

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );

    }

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
      );

    } else {

      // We found a non-quoted value.
      var strMatchedValue = arrMatches[ 3 ];

    }


    // Now that we have our value string, let's add
    // it to the data array.
    // (NOTE FROM MJD): Added as never typing here rather than debug this.
    arrData[ arrData.length - 1 ].push( strMatchedValue.trim() as never );
  }

  // Return the parsed data.
  return( arrData );
}

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
      const rows = CSVToArray(reader.result)
      const definitionsRow = rows[0]
      const dataRows = rows.splice(1)
      const result: T[] = []
      dataRows.forEach(dataRow => {
        const valueFromRow = {}
        for (let i = 0; i < definitionsRow.length; i++) {
          valueFromRow[definitionsRow[i]] = dataRow[i]
        }
        result.push(valueFromRow as T)
      })
      resolve(result)
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

