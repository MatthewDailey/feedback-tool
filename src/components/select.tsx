import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"

export const Select =
  ({ children, ...props }) => {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger>
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
  }


export const SelectItem = ({ children, value, ...props }) => {
    return (
      <SelectPrimitive.Item value={value} {...props}>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  }

