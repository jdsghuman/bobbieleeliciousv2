export const truncateText = (text: string, maxLength: number) => {
  return text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
