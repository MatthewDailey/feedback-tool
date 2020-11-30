import * as React from 'react'
import * as ReactDOM from 'react-dom'

type Content = string

const message: Content = 'hidy ho pals'

ReactDOM.render(
  <h1>{`${message}`}</h1>,
  document.getElementById('root')
);
