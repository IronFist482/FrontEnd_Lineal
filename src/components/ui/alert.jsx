"use client";

import * as React from "react";
import '../../styles/alert.css';

// Simulamos 'cn' y 'cva' para que el JSX sea funcional sin estas librerías.
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Lógica simulada de cva. En el CSS puro se definirán estas clases.
const getAlertClasses = (variant) => {
  const baseClasses = "alert-base";
  let variantClass = "";

  if (variant === "destructive") {
    variantClass = "alert-destructive";
  } else {
    variantClass = "alert-default";
  }

  return `${baseClasses} ${variantClass}`;
};

function Alert({
  className,
  variant,
  ...props
}) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(getAlertClasses(variant), className)}
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