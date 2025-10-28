import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import '../../styles/calendar.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Simulación de buttonVariants, asumiendo que 'outline' y 'ghost' son las variantes usadas.
const buttonVariants = ({ variant }) => {
  if (variant === "outline") {
    return "btn-outline btn-icon-size";
  }
  if (variant === "ghost") {
    return "btn-ghost btn-icon-size";
  }
  return "btn-base";
};

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
        cell: cn(
          "calendar-cell-base",
          props.mode === "range"
            ? "calendar-cell-range-mode"
            : "calendar-cell-single-mode",
        ),
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