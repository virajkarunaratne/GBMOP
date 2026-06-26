export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(
  status: string
): 'success' | 'warning' | 'danger' | 'info' | 'primary' {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'approved':
    case 'active':
    case 'paid':
      return 'success'
    case 'pending':
    case 'review':
    case 'on-hold':
      return 'warning'
    case 'rejected':
    case 'failed':
    case 'cancelled':
    case 'overdue':
      return 'danger'
    case 'draft':
    case 'planning':
      return 'info'
    default:
      return 'primary'
  }
}

export function getPriorityColor(
  priority: string
): 'danger' | 'warning' | 'info' | 'primary' {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'danger'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    case 'low':
      return 'primary'
    default:
      return 'primary'
  }
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-primary-500',
    'bg-secondary-600',
    'bg-danger',
    'bg-warning',
    'bg-success',
    'bg-info',
  ]
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + acc
  }, 0)
  return colors[hash % colors.length]
}

export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function isOverdue(dueDate: string | Date): boolean {
  return new Date(dueDate) < new Date()
}

export function daysUntilDue(dueDate: string | Date): number {
  const today = new Date()
  const due = new Date(dueDate)
  const diff = due.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}
