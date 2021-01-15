let client = require("contentful").createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
});

import { useRouter } from "next/router";

export async function getStaticPaths() {
  let data = await client.getEntries({
    content_type: 'recipe',
  });

  return {
    paths: data.items.map(item => ({
      params: { slug: item.fields.slug },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
    let data = await client.getEntries({
      content_type: 'recipe',
      'fields.slug': params.slug,
    });

    return {
      props: {
        recipe: data.items[0],
      },
    };
  }

export default function Recipe({ recipe }) {
  const router = useRouter();

  console.log('recipe----', recipe)
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return <div>{recipe.fields.recipeTitle}</div>;
}
