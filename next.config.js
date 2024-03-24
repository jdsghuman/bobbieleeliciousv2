/** @type {import('next').NextConfig} */
module.exports = {
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
    ],
  },
}
