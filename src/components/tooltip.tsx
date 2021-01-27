import * as React from 'react'
import { css, styled } from "./styled"
import * as Tooltip from "@radix-ui/react-tooltip"

export const TooltipRoot = Tooltip.Root

export const TooltipTrigger = styled(Tooltip.Trigger, {
  backgroundColor: 'transparent',
  border: 0,
})

const scaleIn = css.keyframes({
  '0%': { opacity: 0, transform: 'scale(0)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

export const TooltipContent = styled(Tooltip.Content, {
  borderRadius: 4,
  padding: '5px 10px',
  fontSize: 12,
  backgroundColor: '$dark',
  color: '$light',

  transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
  animation: `${scaleIn} 0.2s ease-out`,
});

export const TooltipArrow = styled(Tooltip.Arrow, {
  backgroundColor: '$dark',
});