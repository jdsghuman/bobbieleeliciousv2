export const truncateText = (text, maxLength) => {
  return text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
