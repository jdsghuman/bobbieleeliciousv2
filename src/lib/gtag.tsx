// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL): void => {
  window.gtag('config', process.env.GA_TRACKING_ID as string, {
    page_path: url,
  })
}

type GTagEvent = {
  action: string
  category: string
  label: string
  value: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent): void => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
