import Markdown from 'markdown-to-jsx';

let client = require("contentful").createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
});

import { useRouter } from "next/router";

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

export default function Blog({ blog }) {
  const router = useRouter();

  console.log("blog----", blog);
  console.log("content----", blog.fields.secondBody);
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>{blog.fields.title}</div>
      <Markdown>{blog.fields.body}</Markdown>
    </>
  );
}
