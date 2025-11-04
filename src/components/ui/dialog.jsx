"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog@1.1.6";
import { XIcon } from "lucide-react@0.487.0";
import { cva } from "class-variance-authority";
import '../../styles/dialog.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

function Dialog({ ...props }) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

const dialogOverlayVariants = cva("dialog-overlay");

function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(dialogOverlayVariants(), className)}
      {...props}
    />
  );
}

const dialogContentVariants = cva(
  "dialog-content",
  {
    variants: {
      size: {
        default: "dialog-content-default",
        sm: "dialog-content-sm",
        lg: "dialog-content-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

function DialogContent({ className, size, children, ...props }) {
  return (
    <DialogPrimitive.Content
      data-slot="dialog-content"
      className={cn(dialogContentVariants({ size }), className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  );
}

const dialogHeaderVariants = cva("dialog-header");

function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(dialogHeaderVariants(), className)}
      {...props}
    />
  );
}

const dialogFooterVariants = cva("dialog-footer");

function DialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(dialogFooterVariants(), className)}
      {...props}
    />
  );
}

const dialogTitleVariants = cva("dialog-title");

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(dialogTitleVariants(), className)}
      {...props}
    />
  );
}

const dialogDescriptionVariants = cva("dialog-description");

function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(dialogDescriptionVariants(), className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
