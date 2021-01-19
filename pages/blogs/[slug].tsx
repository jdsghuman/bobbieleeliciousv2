import Markdown from "markdown-to-jsx";
import Image from "next/image";

let client = require("contentful").createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
});

import { useRouter } from "next/router";
import { BlogPropType } from "../PropTypes";

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
    revalidate: 60,
  };
}

const Blog: React.FC<BlogPropType> = ({ blog }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h3>{blog.fields.title}</h3>
      {blog.fields.blogImage && (
        <div>
          <Image 
            src={blog.fields.blogImage} 
            layout="intrinsic"
            width={500}
            height={500}
        />
        </div>
      )}
      <p>{blog.fields.author?.fields.name}</p>
      <p>{blog.fields.publishDate}</p>
      <Markdown>{blog.fields.body}</Markdown>
      {blog.fields.tag?.map((t, i) => (
        <p key={t.sys.id}>{t.fields.name}</p>
      ))}
    </div>
  );
};

export default Blog;
