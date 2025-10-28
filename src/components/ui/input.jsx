import * as React from "react";

import '../../styles/input.css';

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`input-field ${className || ""}`.trim()}
      {...props}
    />
  );
}

export { Input };