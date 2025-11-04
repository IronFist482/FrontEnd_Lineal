"use client";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva } from "class-variance-authority";
import '../../styles/avatar.css';
const cn = (...classes) => classes.filter(Boolean).join(' ');

const avatarVariants = cva(
  "avatar-root",
  {
    variants: {
      variant: {
        default: "avatar-default",
        destructive: "avatar-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Avatar({
  className,
  variant,
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        avatarVariants({ variant }),
        className,
      )}
      {...props}
    />
  );
}
const avatarImageVariants = cva("avatar-image");

function AvatarImage({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(avatarImageVariants(), className)}
      {...props}
    />
  );
}
const avatarFallbackVariants = cva(
  "avatar-fallback",
);

function AvatarFallback({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        avatarFallbackVariants(),
        className,
      )}
      {...props}
    />
  );
}
export { Avatar, AvatarImage, AvatarFallback };
