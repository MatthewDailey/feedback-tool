import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import { styled } from "./styled"

const StyledSelect = styled(SelectPrimitive.Root, {})

const StyledItem = styled(SelectPrimitive.SelectItem, {

})

export const Select =
  React.forwardRef<HTMLButtonElement, SelectPrimitive.SelectProps>(({ children, ...props }, ref) => {
    return (
      <StyledSelect {...props} >
        <SelectPrimitive.Trigger ref={ref}>
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon>
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Content>
          <SelectPrimitive.ScrollUpButton>
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton>
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </StyledSelect>
    );
  })

export const SelectItem = React.forwardRef<HTMLDivElement, SelectPrimitive.SelectItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledItem {...props} ref={ref}>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </StyledItem>
    );
  })

