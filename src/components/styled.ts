import { createStyled } from "@stitches/react"

export const colors = {
  $light: '#FAF9F9',
  $dark: '#555B6E',
  $seafoam: '#BEE3DB',
  $teal: '#89B0AE',
  $peach: '#FFD6BA',
}

const breakpoints = {
  sm: (rule) => `@media (max-width: 780px) { ${rule} }`,
}

export const { styled, css } = createStyled({
  prefix: '',
  tokens: {
    colors,
    fontWeights: {
      $medium: '400',
      $heavy: '900',
    },
    borderWidths: {
      $borderWidth: '2px',
    }
  },
  breakpoints,
  utils: {},
});