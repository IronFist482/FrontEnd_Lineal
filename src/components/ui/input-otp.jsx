"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp@1.4.2";
import { MinusIcon } from "lucide-react@0.487.0";

import '../../styles/input-otp.css';

function InputOTP({ className, containerClassName, ...props }) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={`input-otp-container ${
        containerClassName || ""
      }`.trim()}
      className={`input-otp ${className || ""}`.trim()}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }) {
  return (
    <div
      data-slot="input-otp-group"
      className={`input-otp-group ${className || ""}`.trim()}
      {...props}
    />
  );
}

function InputOTPSlot({ index, className, ...props }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={`input-otp-slot ${className || ""}`.trim()}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="input-otp-caret-wrapper">
          <div className="input-otp-caret" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };