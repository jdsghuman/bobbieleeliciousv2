import Head from 'next/head'
import { MetaTags } from '../PropTypes/Tags'

type Props = {
  tags: MetaTags
}

const Meta = ({ tags }: Props) => {
  return (
    <Head>
      <title key="title">{tags.title}</title>
      {tags.description && <meta name="description" key="description" content={tags.description} />}
      <meta
        name="keywords"
        content="healthy recipes, lifestyle blog, nutrition, impact of ultra-processed foods"
      />

      {/* OpenGraph Tags */}
      <meta property="og:type" key="og_type" content={tags.type} />
      {/* this meta tags helps Facebook appropriately title the page when shared within its social network */}
      <meta property="og:title" key="og_title" content={tags.title} />
      {/* Helps facebook describe the page */}
      <meta property="og:description" key="og_description" content={tags.description} />
      {/* The URL of the main page */}
      <meta property="og:url" key="og_URL" content={tags.og_URL || tags.canonical} />
      {/* A url of an image for Facebook to use in a preview. */}
      <meta property="og:image" key="og_image" content={tags.og_image || tags.image} />
      <meta property="og:site_name" key="og_site_name" content={tags.og_site_name || tags.title} />

      {/*Twitter Cards */}
      {tags.twitter_site && (
        <>
          <meta name="twitter:card" key="twitter_card" content="summary" />
          <meta name="twitter:site" key="twitter_site" content={tags.twitter_site} />
          <meta name="twitter:domain" key="twitter_domain" content={tags.twitter_domain} />
          <meta name="twitter:image:src" key="twitter_img" content={tags.image} />
        </>
      )}
      {tags.description && (
        <meta name="twitter:description" key="twitter_description" content={tags.description} />
      )}

      {tags.robots && <meta name="robots" content={`${tags.robots}`} />}
      <meta property="fb:app_id" content={process.env.FACEBOOK_APP_ID} />
      <meta property="fb:admins" content={process.env.FACEBOOK_USER_ID_1} />
      <meta property="fb:admins" content={process.env.FACEBOOK_USER_ID_2} />

      {/* The URL of the canonical tags */}
      {tags.canonical && <link rel="canonical" key="canonical" href={tags.canonical} />}
    </Head>
  )
}

export default Meta
