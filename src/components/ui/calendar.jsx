import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cva } from "class-variance-authority";
import '../../styles/calendar.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const buttonVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "btn-base",
        outline: "btn-outline btn-icon-size",
        ghost: "btn-ghost btn-icon-size",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const calendarCellVariants = cva(
  "calendar-cell-base",
  {
    variants: {
      mode: {
        single: "calendar-cell-single-mode",
        range: "calendar-cell-range-mode",
      },
    },
    defaultVariants: {
      mode: "single",
    },
  }
);

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("calendar-root", className)}
      classNames={{
        months: "calendar-months",
        month: "calendar-month",
        caption: "calendar-caption",
        caption_label: "calendar-caption-label",
        nav: "calendar-nav",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "calendar-nav-button",
        ),
        nav_button_previous: "calendar-nav-button-previous",
        nav_button_next: "calendar-nav-button-next",
        table: "calendar-table",
        head_row: "calendar-head-row",
        head_cell: "calendar-head-cell",
        row: "calendar-row",
        cell: calendarCellVariants({ mode: props.mode }),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "calendar-day",
        ),
        day_range_start:
          "day-range-start day-range-start-selected",
        day_range_end:
          "day-range-end day-range-end-selected",
        day_selected:
          "day-selected-style",
        day_today: "day-today-style",
        day_outside:
          "day-outside day-outside-selected",
        day_disabled: "day-disabled-style",
        day_range_middle:
          "day-range-middle-style",
        day_hidden: "day-hidden-style",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}
export { Calendar };
