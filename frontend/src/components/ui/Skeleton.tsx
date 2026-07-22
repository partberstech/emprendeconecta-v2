import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Render as a circle (equal width/height required) */
  circle?: boolean
  /** Render as a text line block */
  text?: boolean
}

export function Skeleton({
  className,
  circle = false,
  text = false,
  ...props
}: SkeletonProps) {
  if (text) {
    return (
      <div className="space-y-2.5" role="presentation">
        <div
          className={cn('h-3 w-full rounded bg-surface-200 animate-pulse', className)}
          {...props}
        />
        <div className="h-3 w-4/5 rounded bg-surface-200 animate-pulse" />
        <div className="h-3 w-3/5 rounded bg-surface-200 animate-pulse" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-surface-200',
        circle ? 'rounded-full' : 'rounded-lg',
        className,
      )}
      {...props}
    />
  )
}
