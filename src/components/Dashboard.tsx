import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Badge } from './Badge'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'primary',
}) => {
  const variantBg = {
    primary: 'bg-blue-50 text-primary-600',
    secondary: 'bg-yellow-50 text-secondary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  }

  const variantBadge = {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
  } as const

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
            {subtitle && (
              <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                'p-3 rounded-lg',
                variantBg[variant]
              )}
            >
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4">
            <Badge variant={variantBadge[variant]} size="sm">
              <span className="mr-1">
                {trend.direction === 'up' ? '↑' : '↓'}
              </span>
              {Math.abs(trend.value)}%
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ChartContainerProps {
  title: string
  description?: string
  children: React.ReactNode
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  )
}

interface ActivityItemProps {
  icon?: React.ReactNode
  title: string
  description?: string
  timestamp: string
  variant?: 'primary' | 'success' | 'warning' | 'danger'
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  title,
  description,
  timestamp,
  variant = 'primary',
}) => {
  const variantColor = {
    primary: 'text-primary-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  }

  return (
    <div className="flex gap-4 py-3 border-b border-neutral-200 last:border-b-0">
      {icon && (
        <div className={cn('text-lg', variantColor[variant])}>{icon}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        {description && (
          <p className="text-xs text-neutral-600 mt-1 truncate">{description}</p>
        )}
        <p className="text-xs text-neutral-500 mt-1">{timestamp}</p>
      </div>
    </div>
  )
}

interface KPIMetricProps {
  label: string
  value: string | number
  unit?: string
  comparison?: {
    value: number
    period: string
  }
}

export const KPIMetric: React.FC<KPIMetricProps> = ({
  label,
  value,
  unit,
  comparison,
}) => {
  return (
    <div className="p-4 rounded-lg bg-neutral-50">
      <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-neutral-900">{value}</span>
        {unit && (
          <span className="text-sm text-neutral-600">{unit}</span>
        )}
      </div>
      {comparison && (
        <p className="text-xs text-neutral-500 mt-2">
          {comparison.value > 0 ? '+' : ''}{comparison.value}% vs {comparison.period}
        </p>
      )}
    </div>
  )
}
