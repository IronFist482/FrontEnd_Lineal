import * as React from "react";
import { cva } from "class-variance-authority";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const cardVariants = cva(
  "card-root",
  {
    variants: {
      variant: {
        default: "card-default",
        outline: "card-outline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const cardHeaderVariants = cva("card-header");

const cardTitleVariants = cva("card-title");

const cardDescriptionVariants = cva("card-description");

const cardActionVariants = cva("card-action");

const cardContentVariants = cva("card-content");

const cardFooterVariants = cva("card-footer");

function Card({ className, variant, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        cardVariants({ variant }),
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        cardHeaderVariants(),
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <h4
      data-slot="card-title"
      className={cn(cardTitleVariants(), className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn(cardDescriptionVariants(), className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        cardActionVariants(),
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentVariants(), className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn(cardFooterVariants(), className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
