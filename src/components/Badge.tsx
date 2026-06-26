import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
  size?: 'sm' | 'md'
}

const variantStyles = {
  primary: 'bg-primary-100 text-primary-700 border border-primary-200',
  secondary: 'bg-secondary-100 text-secondary-700 border border-secondary-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  danger: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
}

const sizeStyles = {
  sm: 'px-2 py-1 text-xs font-medium',
  md: 'px-3 py-1 text-sm font-medium',
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
)

Badge.displayName = 'Badge'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  image?: string
  initials?: string
  color?: string
}

const sizeStylesAvatar = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-2xl',
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({
    className,
    size = 'md',
    image,
    initials = '?',
    color = 'bg-primary-500',
    ...props
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center rounded-full font-bold text-white overflow-hidden',
        sizeStylesAvatar[size],
        !image && color,
        className
      )}
      {...props}
    >
      {image ? (
        <img src={image} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  )
)

Avatar.displayName = 'Avatar'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const progressVariants = {
  primary: 'bg-primary-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
}

const progressSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({
    className,
    value = 0,
    variant = 'primary',
    size = 'md',
    showLabel = false,
    ...props
  }, ref) => {
    const clampedValue = Math.min(Math.max(value, 0), 100)

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          className={cn(
            'w-full bg-neutral-200 rounded-full overflow-hidden',
            progressSizes[size]
          )}
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-out rounded-full',
              progressVariants[variant]
            )}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
        {showLabel && (
          <p className="text-xs text-neutral-600 mt-1 text-right">
            {clampedValue}%
          </p>
        )}
      </div>
    )
  }
)

Progress.displayName = 'Progress'
