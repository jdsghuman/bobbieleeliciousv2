export const truncateText = (text: string, maxLength: number) => {
  return text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function concatenateStrings(...args: string[]) {
  return args.join(',')
}

export function toDuration(str: string | undefined): string | undefined {
  if (!str) return undefined
  const lower = str.toLowerCase()
  const hours = lower.match(/(\d+)\s*(?:hour|hr|h)/)
  const minutes = lower.match(/(\d+)\s*(?:min|mins|minute|minutes|m)/)
  if (!hours && !minutes) return undefined
  let result = 'PT'
  if (hours) result += `${hours[1]}H`
  if (minutes) result += `${minutes[1]}M`
  return result
}
