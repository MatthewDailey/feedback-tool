import { createStyled } from "@stitches/react"

export const { styled, css } = createStyled({
  prefix: '',
  tokens: {
    colors: {
      $light: '#FAF9F9',
      $dark: '#555B6E',
      $seafoam: '#BEE3DB',
      $teal: '#89B0AE',
      $peach: '#FFD6BA',
    },
    fontWeights: {
      $medium: '400',
      $heavy: '900',
    },
    borderWidths: {
      $borderWidth: '2px',
    }
  },
  breakpoints: {},
  utils: {},
});