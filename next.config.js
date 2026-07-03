/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.filestackcontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
    ],
  },
}
