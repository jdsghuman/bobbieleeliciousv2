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
      <meta property="og:locale" key="og_locale" content="en_US" />
      <meta property="og:type" key="og_type" content={tags.type} />
      <meta property="og:title" key="og_title" content={tags.title} />
      <meta property="og:description" key="og_description" content={tags.description} />
      <meta property="og:url" key="og_URL" content={tags.og_URL || tags.canonical} />
      <meta property="og:image" key="og_image" content={tags.og_image || tags.image} />
      {tags.og_image_width && (
        <meta
          property="og:image:width"
          key="og_image_width"
          content={String(tags.og_image_width)}
        />
      )}
      {tags.og_image_height && (
        <meta
          property="og:image:height"
          key="og_image_height"
          content={String(tags.og_image_height)}
        />
      )}
      <meta
        property="og:site_name"
        key="og_site_name"
        content={tags.og_site_name || 'Bobbieleelicious'}
      />

      {/*Twitter Cards */}
      {tags.twitter_card && (
        <>
          <meta name="twitter:card" key="twitter_card" content={tags.twitter_card} />
          <meta name="twitter:image" key="twitter_img" content={tags.og_image || tags.image} />
        </>
      )}
      {tags.twitter_site && (
        <>
          <meta name="twitter:site" key="twitter_site" content={tags.twitter_site} />
          <meta name="twitter:domain" key="twitter_domain" content={tags.twitter_domain} />
        </>
      )}
      {tags.description && (
        <meta name="twitter:description" key="twitter_description" content={tags.description} />
      )}

      {/* Article OG tags */}
      {tags.article_publishedTime && (
        <meta
          property="article:published_time"
          key="article_published_time"
          content={tags.article_publishedTime}
        />
      )}
      {tags.article_author && (
        <meta property="article:author" key="article_author" content={tags.article_author} />
      )}
      {tags.article_author_name && (
        <meta name="author" key="author" content={tags.article_author_name} />
      )}
      {tags.article_section && (
        <meta property="article:section" key="article_section" content={tags.article_section} />
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
