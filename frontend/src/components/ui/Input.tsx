import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  label?: string
  /** Error message shown below the input; also sets error styling */
  error?: string
  /** Icon rendered at the left side of the input */
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined)

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-surface-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span
              className={cn(
                'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
                error ? 'text-error' : 'text-surface-400',
              )}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base
              'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-surface-900',
              'placeholder:text-surface-400',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-50',
              // Icon padding
              icon && 'pl-10',
              // Error state
              error
                ? 'border-error text-error focus-visible:ring-error/40'
                : 'border-surface-300 focus-visible:border-brand-500 focus-visible:ring-brand-500/40',
              className,
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error && inputId ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>

        {error && (
          <p
            id={inputId ? `${inputId}-error` : undefined}
            className="mt-1 text-xs text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
