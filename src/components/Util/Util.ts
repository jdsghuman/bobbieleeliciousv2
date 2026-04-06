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

// Escapes characters that can affect HTML/script parsing when JSON-LD is embedded inline.
export function safeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
