"use client";
import * as React from "react";
import { cva } from "class-variance-authority";
import '../../styles/alert.css';
// Simulamos 'cn' para que el JSX sea funcional sin estas librerías.
const cn = (...classes) => classes.filter(Boolean).join(' ');

const alertVariants = cva(
  "alert-base",
  {
    variants: {
      variant: {
        default: "alert-default",
        destructive: "alert-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}
function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "alert-title",
        className,
      )}
      {...props}
    />
  );
}
function AlertDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "alert-description",
        className,
      )}
      {...props}
    />
  );
}
export { Alert, AlertTitle, AlertDescription };
