import Markdown from 'markdown-to-jsx';

let client = require("contentful").createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
});

import { useRouter } from "next/router";
import { BlogPropType } from '../PropTypes'

export async function getStaticPaths() {
  let data = await client.getEntries({
    content_type: "blogPost",
  });

  return {
    paths: data.items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  let data = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": params.slug,
  });

  return {
    props: {
      blog: data.items[0],
    },
  };
}

const Blog: React.FC<BlogPropType> = ({ blog }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>{blog.fields.title}</div>
      {blog.fields.blogImage && <img src={blog.fields.blogImage} />}
      <p>{blog.fields.author?.fields.name}</p>
      <p>{blog.fields.publishDate}</p>
      <Markdown>{blog.fields.body}</Markdown>
      {blog.fields.tag?.map((t, i) => <p key={t.sys.id}>{t.fields.name}</p>)}
    </>
  );
}

export default Blog
