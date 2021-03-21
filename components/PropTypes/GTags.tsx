// Add your GA tracking id here
export const GA_TRACKING_ID = 'UA-151713725-1'

const isProduction = process.env.NODE_ENV.toLowerCase() === 'production'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const trackPageView = (url: URL) => {
  if (isProduction) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

type GTagEvent = {
  action: string
  category: string
  label: string
  value: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const trackEvent = ({ action, category, label, value }: GTagEvent) => {
  if (isProduction) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
