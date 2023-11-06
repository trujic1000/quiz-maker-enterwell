"use client";

import React, { type ForwardedRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type DialogContentProps = {
  title: string;
  onClose?: () => void;
  className?: string;
};

export const DialogContent = React.forwardRef(
  (
    {
      title,
      onClose,
      children,
      className = "",
      ...props
    }: React.PropsWithChildren<DialogContentProps>,
    forwardedRef: ForwardedRef<HTMLDivElement>,
  ) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <DialogPrimitive.Content
        {...props}
        ref={forwardedRef}
        onPointerDownOutside={onClose}
        className={twMerge(
          clsx(
            "fixed left-1/2 top-1/2 w-[36rem] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-2xl shadow-lg focus:outline-none",
            className,
          ),
        )}
      >
        <DialogPrimitive.Title className="bg-gray-900 px-10 py-6 text-[1.375rem] font-bold leading-normal text-white">
          {title}
        </DialogPrimitive.Title>
        {children}
        <DialogPrimitive.Close
          onClick={onClose}
          aria-label="Close"
          className="absolute right-8 top-6 inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
        >
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="#fff"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="#fff"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);

DialogContent.displayName = "DialogContent";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
