import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"

export const Select =
  React.forwardRef<HTMLButtonElement, SelectPrimitive.SelectProps>(({ children, ...props }, ref) => {
    return (
      <SelectPrimitive.Root {...props} >
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
      </SelectPrimitive.Root>
    );
  })

export const SelectItem = React.forwardRef<HTMLDivElement, SelectPrimitive.SelectItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <SelectPrimitive.Item {...props} ref={ref}>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  })

