"use client";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul@1.1.2";
import { cva } from "class-variance-authority";
import '../../styles/drawer.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

function Drawer({ ...props }) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

const drawerOverlayVariants = cva("drawer-overlay");

function DrawerOverlay({ className, ...props }) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(drawerOverlayVariants(), className)}
      {...props}
    />
  );
}

const drawerContentVariants = cva(
  "drawer-content",
  {
    variants: {
      direction: {
        bottom: "drawer-content-bottom",
        top: "drawer-content-top",
        left: "drawer-content-left",
        right: "drawer-content-right",
      },
    },
    defaultVariants: {
      direction: "bottom",
    },
  }
);

function DrawerContent({ className, direction, ...props }) {
  return (
    <DrawerPrimitive.Content
      data-slot="drawer-content"
      className={cn(drawerContentVariants({ direction }), className)}
      {...props}
    />
  );
}

const drawerHeaderVariants = cva("drawer-header");

function DrawerHeader({ className, ...props }) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(drawerHeaderVariants(), className)}
      {...props}
    />
  );
}

const drawerFooterVariants = cva("drawer-footer");

function DrawerFooter({ className, ...props }) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(drawerFooterVariants(), className)}
      {...props}
    />
  );
}

const drawerTitleVariants = cva("drawer-title");

function DrawerTitle({ className, ...props }) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(drawerTitleVariants(), className)}
      {...props}
    />
  );
}

const drawerDescriptionVariants = cva("drawer-description");

function DrawerDescription({ className, ...props }) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(drawerDescriptionVariants(), className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
