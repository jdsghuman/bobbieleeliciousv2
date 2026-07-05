declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

const GA_ID = process.env.GA_TRACKING_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  if (typeof window === 'undefined' || !window.gtag || !GA_ID) return
  window.gtag('config', GA_ID, { page_path: url })
}

type GTagEvent = {
  action: string
  category: string
  label: string
  value: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent): void => {
  if (typeof window === 'undefined' || !window.gtag || !GA_ID) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
