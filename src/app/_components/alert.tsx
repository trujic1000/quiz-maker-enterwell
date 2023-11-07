"use client";
import React, { type ForwardedRef } from "react";
import * as AlertPrimitive from "@radix-ui/react-alert-dialog";
import { clsx } from "clsx";

type Props = {
  title: string;
  className?: string;
  isLoading?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  confirmText?: string;
  onConfirm: () => void;
};

export const AlertContent = React.forwardRef(
  (
    {
      title,
      children,
      cancelText = "Cancel",
      onCancel,
      confirmText = "Remove",
      onConfirm,
      isLoading = false,
      className = "",
      ...props
    }: React.PropsWithChildren<Props>,
    forwardedRef: ForwardedRef<HTMLDivElement>,
  ) => (
    <AlertPrimitive.Portal>
      <AlertPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <AlertPrimitive.Content
        {...props}
        ref={forwardedRef}
        className={clsx(
          "fixed left-1/2 top-1/2 max-h-[85vh] w-[36rem] -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-2xl shadow-lg focus:outline-none",
          className,
        )}
      >
        <AlertPrimitive.Title className="bg-gray-900 px-10 py-6 text-[1.375rem] font-bold leading-normal text-white">
          {title}
        </AlertPrimitive.Title>
        <div className="grid gap-10 bg-white p-10 text-center">
          <div className="py-6">{children}</div>
          <div className="flex justify-between">
            <AlertPrimitive.Action asChild>
              <button
                type="button"
                className="rounded-full border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            </AlertPrimitive.Action>
            <button
              type="button"
              className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {confirmText}
            </button>
          </div>
        </div>
        <AlertPrimitive.Cancel
          aria-label="cancel"
          className="absolute right-8 top-6 inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
          onClick={onCancel}
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
        </AlertPrimitive.Cancel>
      </AlertPrimitive.Content>
    </AlertPrimitive.Portal>
  ),
);

AlertContent.displayName = "AlertContent";

export const Alert = AlertPrimitive.Root;
export const AlertTrigger = AlertPrimitive.Trigger;
