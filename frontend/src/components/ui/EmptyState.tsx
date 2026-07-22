import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Button, type ButtonProps } from './Button'

export interface EmptyStateProps {
  /** Icon element (e.g. a Lucide icon component) */
  icon?: ReactNode
  /** Main heading */
  title: string
  /** Supporting text */
  description?: string
  /** Optional call-to-action button config */
  action?: {
    label: string
    onClick: () => void
    variant?: ButtonProps['variant']
  }
  /** Additional wrapper class */
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-100 text-surface-400">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-surface-900">{title}</h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-surface-500">
          {description}
        </p>
      )}

      {action && (
        <Button
          variant={action.variant ?? 'primary'}
          className="mt-6"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
