/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { type FieldError, type UseFormRegister } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export type InputProps = {
  label?: string;
  fieldsetClassName?: string;
  labelClassName?: string;
  error?: FieldError;
  register?: UseFormRegister<any>;
} & React.ComponentProps<"input">;

export const Input = ({
  name = "",
  label,
  fieldsetClassName = "",
  labelClassName = "",
  className,
  error,
  register,
  required = false,
  disabled,
  onChange,
  ...props
}: InputProps) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // If there's a registered onChange from react-hook-form
    if (register && typeof register(name).onChange === "function") {
      void register(name).onChange(event);
    }
    // If there's a passed-in onChange prop
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <fieldset className={fieldsetClassName}>
      {label && (
        <label
          htmlFor={name}
          className={twMerge(
            clsx(
              "mb-2 block font-bold leading-8 text-black",
              disabled && "text-gray-400",
              required && "after:text-red-700 after:content-['_*']",
              required && disabled && "after:text-red-700 after:content-['_*']",
              labelClassName,
            ),
          )}
        >
          {label}
        </label>
      )}
      <div className="relative px-[3px]">
        <input
          className={twMerge(
            clsx(
              "h-12 w-full rounded-2xl bg-gray-200 py-0",
              "flex flex-row items-center gap-2",
              "hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-600",
              error && "border-2 border-red-700",
              className,
            ),
          )}
          {...(register
            ? {
                ...register(name),
                ref: (e: HTMLInputElement) => {
                  inputRef.current = e;
                  register(name).ref(e);
                },
              }
            : {})}
          onChange={handleOnChange}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <ErrorMessage error={error} />}
    </fieldset>
  );
};

export const ErrorMessage = ({ error }: { error: FieldError }) => (
  <p className="absolute mt-2 block text-xs leading-6 text-red-700">
    {error.type === "required" ? "This field is required" : error.message}
  </p>
);
