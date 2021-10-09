export const loadPolyfills = async () => {
  if (!('IntersectionObserver' in window)) {
    //     // This is specifically for Safari - Polyfill
    await import('intersection-observer')
  }
}
