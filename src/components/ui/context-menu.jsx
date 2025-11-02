"use client";
import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu@2.2.6";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react@0.487.0";
import { cva } from "class-variance-authority";
import '../../styles/context-menu.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

function ContextMenu({ ...props }) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({ ...props }) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

function ContextMenuGroup({ ...props }) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuPortal({ ...props }) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuSub({ ...props }) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({ ...props }) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

const contextMenuSubTriggerVariants = cva(
  "context-menu-sub-trigger",
  {
    variants: {
      inset: {
        true: "pl-8",
      },
    },
    defaultVariants: {
      inset: false,
    },
  }
);

function ContextMenuSubTrigger({ className, inset, children, ...props }) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      className={cn(contextMenuSubTriggerVariants({ inset }), className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="context-menu-chevron" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

const contextMenuSubContentVariants = cva("context-menu-sub-content");

function ContextMenuSubContent({ className, ...props }) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(contextMenuSubContentVariants(), className)}
      {...props}
    />
  );
}

const contextMenuContentVariants = cva("context-menu-content");

function ContextMenuContent({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(contextMenuContentVariants(), className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

const contextMenuItemVariants = cva(
  "context-menu-item",
  {
    variants: {
      variant: {
        default: "context-menu-item-default",
        destructive: "context-menu-item-destructive",
      },
      inset: {
        true: "pl-8",
      },
    },
    defaultVariants: {
      variant: "default",
      inset: false,
    },
  }
);

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      className={cn(contextMenuItemVariants({ variant, inset }), className)}
      {...props}
    />
  );
}

const contextMenuCheckboxItemVariants = cva("context-menu-checkbox-item");

const contextMenuCheckboxIndicatorWrapperVariants = cva("context-menu-checkbox-indicator-wrapper");

const contextMenuCheckIconVariants = cva("context-menu-check-icon");

function ContextMenuCheckboxItem({ className, children, checked, ...props }) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(contextMenuCheckboxItemVariants(), className)}
      checked={checked}
      {...props}
    >
      <span className={cn(contextMenuCheckboxIndicatorWrapperVariants())}>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className={cn(contextMenuCheckIconVariants())} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

const contextMenuRadioItemVariants = cva("context-menu-radio-item");

const contextMenuRadioIndicatorWrapperVariants = cva("context-menu-radio-indicator-wrapper");

const contextMenuRadioIconVariants = cva("context-menu-radio-icon");

function ContextMenuRadioItem({ className, children, ...props }) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(contextMenuRadioItemVariants(), className)}
      {...props}
    >
      <span className={cn(contextMenuRadioIndicatorWrapperVariants())}>
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className={cn(contextMenuRadioIconVariants())} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

const contextMenuLabelVariants = cva(
  "context-menu-label",
  {
    variants: {
      inset: {
        true: "pl-8",
      },
    },
    defaultVariants: {
      inset: false,
    },
  }
);

function ContextMenuLabel({ className, inset, ...props }) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      className={cn(contextMenuLabelVariants({ inset }), className)}
      {...props}
    />
  );
}

const contextMenuSeparatorVariants = cva("context-menu-separator");

function ContextMenuSeparator({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(contextMenuSeparatorVariants(), className)}
      {...props}
    />
  );
}

const contextMenuShortcutVariants = cva("context-menu-shortcut");

function ContextMenuShortcut({ className, ...props }) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(contextMenuShortcutVariants(), className)}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
