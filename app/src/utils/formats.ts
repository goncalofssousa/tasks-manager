export function formatDate(date: string): string {
  const inputDate = new Date(date)
  const today = new Date()

  today.setHours(0, 0, 0, 0)
  inputDate.setHours(0, 0, 0, 0)

  const diffDays = Math.floor((today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'

  if (diffDays <= 7) return 'Last week'
  if (diffDays <= 30) return 'Last month'
  if (diffDays <= 365) return 'Last year'

  return inputDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function toDate(date?: string) {
  return date ? new Date(date) : null
}