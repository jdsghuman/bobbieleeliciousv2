export enum PageType {
  website = 'website',
  article = 'article',
}

export enum RobotsContent {
  follow = 'follow',
  index = 'index',
  no_follow = 'nofollow',
  no_index = 'noindex',
}

export type MetaTags = {
  title: string
  author?: string
  description: string
  type: PageType
  og_type?: PageType
  image: string
  robots: string
  og_title?: string
  og_description?: string
  og_URL?: string
  canonical: string
  og_image?: string
  og_image_width?: number
  og_image_height?: number
  og_site_name?: string
  twitter_card?: string
  twitter_description?: string
  twitter_site?: string
  twitter_domain?: string
  twitter_img?: string
  article_publishedTime?: string
  // article:author expects a URL per the OG spec
  article_author?: string
  // human-readable author name, rendered as <meta name="author">
  article_author_name?: string
  article_section?: string
}
