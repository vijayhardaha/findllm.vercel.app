import { type ComponentPropsWithRef, type JSX, type ReactNode } from 'react';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/utils';

/**
 * Select component wrapping Radix UI Select primitive.
 */
const Select = SelectPrimitive.Root;

/**
 * SelectValue component displaying the current value.
 */
const SelectValue = SelectPrimitive.Value;

/**
 * Props for SelectTrigger component.
 *
 * @interface SelectTriggerProps
 * @property {string} [className] - Additional CSS classes for the trigger element.
 * @property {ReactNode} [children] - Content displayed inside the trigger.
 */
interface SelectTriggerProps extends ComponentPropsWithRef<typeof SelectPrimitive.Trigger> {
  className?: string;
  children?: ReactNode;
}

/**
 * SelectTrigger component for opening the select dropdown.
 *
 * @param {SelectTriggerProps} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {ReactNode} [props.children] - Child elements.
 *
 * @returns {JSX.Element} SelectTrigger component.
 */
function SelectTrigger({ className, children, ref, ...props }: SelectTriggerProps): JSX.Element {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      id="select-trigger"
      className={cn(
        'flex h-10 items-center justify-between border-2 border-black bg-white px-3 py-2 text-sm font-medium text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className || 'w-full'
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/**
 * Props for SelectScrollUpButton component.
 *
 * @interface SelectScrollUpButtonProps
 * @property {string} [className] - Additional CSS classes for the scroll up button.
 */
interface SelectScrollUpButtonProps extends ComponentPropsWithRef<typeof SelectPrimitive.ScrollUpButton> {
  className?: string;
}

/**
 * SelectScrollUpButton component for scrolling up in the dropdown.
 *
 * @param {SelectScrollUpButtonProps} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 *
 * @returns {JSX.Element} SelectScrollUpButton component.
 */
function SelectScrollUpButton({ className, ref, ...props }: SelectScrollUpButtonProps): JSX.Element {
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn('flex cursor-pointer justify-center py-1', className)}
      {...props}
    />
  );
}
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

/**
 * Props for SelectScrollDownButton component.
 *
 * @interface SelectScrollDownButtonProps
 * @property {string} [className] - Additional CSS classes for the scroll down button.
 */
interface SelectScrollDownButtonProps extends ComponentPropsWithRef<typeof SelectPrimitive.ScrollDownButton> {
  className?: string;
}

/**
 * SelectScrollDownButton component for scrolling down in the dropdown.
 *
 * @param {SelectScrollDownButtonProps} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 *
 * @returns {JSX.Element} SelectScrollDownButton component.
 */
function SelectScrollDownButton({ className, ref, ...props }: SelectScrollDownButtonProps): JSX.Element {
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn('flex cursor-pointer justify-center py-1', className)}
      {...props}
    />
  );
}
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

/**
 * Props for SelectContent component.
 *
 * @interface SelectContentProps
 * @property {string} [className] - Additional CSS classes for the content container.
 * @property {ReactNode} [children] - Child elements.
 * @property {'popper' | 'item-aligned'} [position] - Positioning strategy (default: 'popper').
 */
interface SelectContentProps extends ComponentPropsWithRef<typeof SelectPrimitive.Content> {
  className?: string;
  children?: ReactNode;
  position?: 'popper' | 'item-aligned';
}

/**
 * SelectContent component for the dropdown content.
 *
 * @param {SelectContentProps} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {ReactNode} [props.children] - Child elements.
 * @param {string} [props.position] - Positioning strategy (default: 'popper').
 *
 * @returns {JSX.Element} SelectContent component.
 */
function SelectContent({ className, children, ref, position = 'popper', ...props }: SelectContentProps): JSX.Element {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn('shadow-neo-md relative z-50 max-h-60 min-w-32 border-2 border-black bg-white', className)}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn('p-1', position === 'popper' && 'h-(--radix-select-trigger-height) w-full')}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
SelectContent.displayName = SelectPrimitive.Content.displayName;

/**
 * Props for SelectItem component.
 *
 * @interface SelectItemProps
 * @property {string} [className] - Additional CSS classes for the item.
 * @property {ReactNode} [children] - Child elements.
 */
interface SelectItemProps extends ComponentPropsWithRef<typeof SelectPrimitive.Item> {
  className?: string;
  children?: ReactNode;
}

/**
 * SelectItem component for individual select options.
 *
 * @param {SelectItemProps} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {ReactNode} [props.children] - Child elements.
 *
 * @returns {JSX.Element} SelectItem component.
 */
function SelectItem({ className, children, ref, ...props }: SelectItemProps): JSX.Element {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'data-highlighted:bg-primary flex cursor-pointer items-center gap-2 px-3 py-2 pl-8 text-sm focus:outline-none data-highlighted:text-black',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
SelectItem.displayName = SelectPrimitive.Item.displayName;

/**
 * Props for SelectSeparator component.
 *
 * @interface SelectSeparatorProps
 * @property {string} [className] - Additional CSS classes for the separator.
 */
interface SelectSeparatorProps extends ComponentPropsWithRef<typeof SelectPrimitive.Separator> {
  className?: string;
}

/**
 * SelectSeparator component for visual separators in the dropdown.
 *
 * @param {SelectSeparatorProps} props - Component props.
 * @param {string} [props.className] - Additional CSS classes.
 *
 * @returns {JSX.Element} SelectSeparator component.
 */
function SelectSeparator({ className, ref, ...props }: SelectSeparatorProps): JSX.Element {
  return <SelectPrimitive.Separator ref={ref} className={cn('bg-muted -mx-1 my-1 h-px', className)} {...props} />;
}
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
