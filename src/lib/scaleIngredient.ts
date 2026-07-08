const FRACTION_MAP: Array<[string, number]> = [
  ['⅛', 1 / 8],
  ['¼', 1 / 4],
  ['⅓', 1 / 3],
  ['⅜', 3 / 8],
  ['½', 1 / 2],
  ['⅝', 5 / 8],
  ['⅔', 2 / 3],
  ['¾', 3 / 4],
  ['⅞', 7 / 8],
]

const FRACTIONS_OUT: Array<[number, string]> = FRACTION_MAP.map(([sym, val]) => [val, sym])

function parseLeadingNumber(str: string): { value: number; end: number } | null {
  // Mixed number + unicode fraction: "1 ¾"
  for (const [char, val] of FRACTION_MAP) {
    const m = str.match(new RegExp(`^(\\d+)\\s+(${char})`))
    if (m) return { value: parseInt(m[1]) + val, end: m[0].length }
  }
  // Standalone unicode fraction: "¾"
  for (const [char, val] of FRACTION_MAP) {
    if (str.startsWith(char)) return { value: val, end: char.length }
  }
  // Mixed number + ASCII fraction: "1 1/2"
  const mixed = str.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)/)
  if (mixed) {
    return {
      value: parseInt(mixed[1]) + parseInt(mixed[2]) / parseInt(mixed[3]),
      end: mixed[0].length,
    }
  }
  // ASCII fraction: "1/2"
  const frac = str.match(/^(\d+)\s*\/\s*(\d+)/)
  if (frac) {
    return { value: parseInt(frac[1]) / parseInt(frac[2]), end: frac[0].length }
  }
  // Decimal or integer
  const num = str.match(/^(\d+\.?\d*)/)
  if (num) {
    return { value: parseFloat(num[1]), end: num[0].length }
  }
  return null
}

function formatNumber(n: number): string {
  if (n <= 0) return String(Math.max(0, Math.round(n * 10) / 10))

  const whole = Math.floor(n)
  const frac = n - whole

  if (frac > 0.01) {
    let bestSymbol = ''
    let bestDiff = Infinity
    for (const [val, symbol] of FRACTIONS_OUT) {
      const diff = Math.abs(frac - val)
      if (diff < bestDiff) {
        bestDiff = diff
        bestSymbol = symbol
      }
    }
    if (bestDiff < 0.09) {
      return whole > 0 ? `${whole} ${bestSymbol}` : bestSymbol
    }
  }

  if (Math.abs(n - Math.round(n)) < 0.1) return String(Math.round(n))
  return String(Math.round(n * 10) / 10)
}

export function scaleIngredient(value: string, multiplier: number): string {
  if (multiplier === 1) return value
  // Preserve leading whitespace so display stays consistent
  const leadingSpace = value.match(/^(\s*)/)?.[1] ?? ''
  const trimmed = value.slice(leadingSpace.length)
  const parsed = parseLeadingNumber(trimmed)
  if (!parsed) return value
  return leadingSpace + formatNumber(parsed.value * multiplier) + trimmed.slice(parsed.end)
}
