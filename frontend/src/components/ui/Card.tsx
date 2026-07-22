import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

const variantStyles = {
  default: 'border border-surface-200 bg-white shadow-xs',
  elevated: 'border border-surface-100 bg-white shadow-lg',
  bordered: 'border-2 border-surface-200 bg-white',
  glass: 'border border-white/20 bg-white/70 backdrop-blur-xl',
} as const

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: keyof typeof variantStyles
  /** Enable hover lift effect */
  hover?: boolean
  /** Render as a different element (e.g. 'article', 'section') */
  as?: ElementType
  /** Right-top action slot */
  action?: ReactNode
}

export function Card({
  className,
  variant = 'default',
  hover = false,
  as: Component = 'div',
  action,
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        'rounded-xl p-6 transition-all duration-200',
        variantStyles[variant],
        hover && 'hover:-translate-y-0.5 hover:shadow-xl cursor-pointer',
        className,
      )}
      {...props}
    >
      {action ? (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">{children}</div>
          <div className="shrink-0">{action}</div>
        </div>
      ) : (
        children
      )}
    </Component>
  )
}

/** Convenience: card header slot */
export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 flex items-center justify-between gap-3', className)} {...props}>
      {children}
    </div>
  )
}

/** Convenience: card body slot */
export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

/** Convenience: card footer slot */
export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-4 flex items-center gap-3 border-t border-surface-100 pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}
