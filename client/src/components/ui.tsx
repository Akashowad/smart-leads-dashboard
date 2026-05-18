import clsx from "clsx";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

export const Button = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={clsx(
      "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60",
      className
    )}
    {...props}
  />
);

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={clsx(
      "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-brand-500/20 focus:ring-4 dark:border-slate-700 dark:bg-slate-900",
      className
    )}
    {...props}
  />
);

export const Select = ({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={clsx(
      "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-brand-500/20 focus:ring-4 dark:border-slate-700 dark:bg-slate-900",
      className
    )}
    {...props}
  />
);

export const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs font-medium text-red-600">{message}</p> : null;
