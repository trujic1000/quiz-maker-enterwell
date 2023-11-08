"use client";
import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { type Control, Controller } from "react-hook-form";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type CheckboxOption = {
  value: string;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
};

type BaseProps = {
  options: CheckboxOption[];
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
  onChange?: (value: string[]) => void;
  searchQuery?: string;
};

type ItemProps = BaseProps & {
  value: string[];
};

const CheckboxGroupItem = React.forwardRef<any, ItemProps>(
  (
    {
      options,
      value = [],
      onChange,
      disabled = false,
      orientation = "vertical",
      className = "",
      searchQuery,
    },
    ref,
  ) => {
    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      return options.filter(
        (option) =>
          option.label?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }, [options, searchQuery]);

    return (
      <div
        className={twMerge(
          clsx(
            "font-inter flex gap-4 leading-loose disabled:text-gray-400",
            orientation === "vertical" && "flex-col gap-4",
            disabled && "pointer-events-none text-gray-400",
            className,
          ),
        )}
        ref={ref}
      >
        <>
          {searchQuery && filteredOptions.length > 0 && (
            <span className="font-inter block font-semibold leading-loose text-black">
              {`${filteredOptions.length} Results`}
            </span>
          )}
          {filteredOptions.map(
            (
              { label, value: optionValue, disabled: optionDisabled },
              index,
            ) => (
              <div
                key={`${index}_${label || ""}`}
                className="flex items-center gap-4"
              >
                <CheckboxPrimitive.Root
                  id={optionValue}
                  checked={value.includes(optionValue)}
                  disabled={optionDisabled && disabled}
                  className={twMerge(
                    clsx(
                      "flex h-4 w-4 flex-row items-center justify-center rounded-md bg-white",
                      "data-[state=unchecked]:border",
                      optionDisabled && disabled
                        ? "data-[state=checked]:bg-blue-400"
                        : "data-[state=checked]:bg-blue-600",
                      optionDisabled && disabled
                        ? "data-[state=unchecked]:border-gray-400"
                        : "data-[state=unchecked]:border-gray-500",
                    ),
                  )}
                  onCheckedChange={() => {
                    const newValue = value.includes(optionValue)
                      ? value.filter((v) => v !== optionValue)
                      : [...value, optionValue];
                    onChange && onChange(newValue);
                  }}
                >
                  <CheckboxPrimitive.Indicator>
                    <svg
                      width={12}
                      height={12}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.4545 6L8.45455 18L3 12.5455"
                        stroke="#fff"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
                {label && (
                  <label
                    htmlFor={optionValue}
                    className={clsx(
                      "flex-1 border-b border-transparent text-black",
                    )}
                  >
                    {label}
                  </label>
                )}
              </div>
            ),
          )}
        </>
      </div>
    );
  },
);

CheckboxGroupItem.displayName = "CheckboxGroupItem";

type Props = BaseProps & {
  control: Control<any>;
  name: string;
  required?: boolean;
  label?: string;
  labelClassName?: string;
  fieldsetClassName?: string;
};

export const CheckboxGroup = ({
  control,
  name,
  label,
  labelClassName = "",
  fieldsetClassName = "",
  disabled,
  required,
  options,
  onChange,
  ...rest
}: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field: { onChange: rhfOnChange, value, ref } }) => (
        <fieldset className={fieldsetClassName}>
          {label && (
            <>
              <label
                htmlFor={name}
                className={twMerge(
                  clsx(
                    "mb-2 block font-bold leading-8 text-black",
                    disabled && "text-gray-400",
                    required && "after:text-error-2 after:content-['_*']",
                    required &&
                      disabled &&
                      "after:text-error-1 after:content-['_*']",
                    labelClassName,
                  ),
                )}
              >
                {label}
              </label>
            </>
          )}
          <CheckboxGroupItem
            {...rest}
            options={options}
            value={value as string[]}
            disabled={disabled}
            onChange={(value) => {
              rhfOnChange(value);
              onChange && onChange(value);
            }}
            ref={ref}
          />
        </fieldset>
      )}
    />
  );
};
