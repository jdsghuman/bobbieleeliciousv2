import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Matches the bot signature seen in GA4: empty/scripted user-agents with no real browser
const BLOCKED_USER_AGENT_PATTERNS = [
  /^$/,
  /python-requests/i,
  /curl\//i,
  /wget/i,
  /scrapy/i,
  /headlesschrome/i,
  /phantomjs/i,
  /go-http-client/i,
  /axios/i,
]

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') ?? ''

  if (BLOCKED_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse('Forbidden', {
      status: 403,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
