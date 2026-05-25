import * as React from "react";

import { MinusIcon } from "lucide-react";

import { cn } from "../../lib/utils";

interface InputOTPProps {
  value?: string;

  onChange?: (
    value: string
  ) => void;

  maxLength?: number;

  className?: string;

  containerClassName?: string;
}

export function InputOTP({
  value = "",
  onChange,
  maxLength = 6,
  className,
  containerClassName,
}: InputOTPProps) {
  const inputsRef =
    React.useRef<
      Array<HTMLInputElement | null>
    >([]);

  const values =
    value.split("");

  const handleChange = (
    index: number,
    val: string
  ) => {
    const newValue =
      value.split("");

    newValue[index] =
      val.slice(-1);

    const finalValue =
      newValue.join("");

    onChange?.(finalValue);

    if (
      val &&
      inputsRef.current[
        index + 1
      ]
    ) {
      inputsRef.current[
        index + 1
      ]?.focus();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        containerClassName
      )}
    >
      {Array.from({
        length: maxLength,
      }).map((_, index) => (
        <input
          key={index}
          ref={(el) =>
            (inputsRef.current[
              index
            ] = el)
          }
          type="text"
          maxLength={1}
          value={
            values[index] || ""
          }
          onChange={(e) =>
            handleChange(
              index,
              e.target.value
            )
          }
          className={cn(
            "border-input bg-background flex h-10 w-10 rounded-md border text-center text-sm outline-none focus:ring-2 focus:ring-primary",
            className
          )}
        />
      ))}
    </div>
  );
}

export function InputOTPGroup({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function InputOTPSlot({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-input bg-background flex h-10 w-10 items-center justify-center rounded-md border text-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function InputOTPSeparator() {
  return (
    <div className="flex items-center justify-center">
      <MinusIcon className="h-4 w-4" />
    </div>
  );
}