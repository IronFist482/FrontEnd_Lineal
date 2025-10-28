"use client";

import '../../styles/command.css'

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Componentes de Dialog simulados (deben ser importados si existen)
function Dialog({ ...props }) { return <div {...props} />; }
function DialogContent({ className, ...props }) { return <div className={cn("dialog-content-base", className)} {...props} />; }
function DialogHeader({ className, ...props }) { return <div className={cn("dialog-header-base", className)} {...props} />; }
function DialogTitle({ ...props }) { return <h2 {...props} />; }
function DialogDescription({ ...props }) { return <p {...props} />; }

function Command({
  className,
  ...props
}) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "command-root",
        className,
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0">
        <Command className="command-dialog-internal-styles">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="command-input-wrapper"
    >
      <SearchIcon className="command-search-icon" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "command-input",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "command-list",
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="command-empty"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "command-group",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("command-separator", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "command-item",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "command-shortcut",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};