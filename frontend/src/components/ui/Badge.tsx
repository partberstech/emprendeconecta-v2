import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const colorStyles = {
  brand: 'bg-brand-100 text-brand-700',
  surface: 'bg-surface-100 text-surface-700',
  accent: 'bg-amber-100 text-amber-700',
  success: 'bg-emerald-100 text-emerald-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
} as const

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-[10px] leading-tight',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
} as const

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Colour scheme */
  color?: keyof typeof colorStyles
  /** Badge size */
  size?: keyof typeof sizeStyles
  /** Render as dot indicator (no text) */
  dot?: boolean
}

export function Badge({
  className,
  color = 'brand',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  if (dot) {
    return (
      <span
        className={cn(
          'inline-block rounded-full',
          colorStyles[color].split(' ')[0], // bg color only
          size === 'sm' && 'h-1.5 w-1.5',
          size === 'md' && 'h-2 w-2',
          size === 'lg' && 'h-2.5 w-2.5',
          className,
        )}
        aria-hidden="true"
        {...props}
      />
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        colorStyles[color],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
