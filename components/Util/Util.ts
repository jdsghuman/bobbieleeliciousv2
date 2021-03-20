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
