let client = require("contentful").createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
});

import Markdown from "markdown-to-jsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { RecipePropType } from "../PropTypes";

export async function getStaticPaths() {
  let data = await client.getEntries({
    content_type: "recipe",
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
    content_type: "recipe",
    "fields.slug": params.slug,
  });

  return {
    props: {
      recipe: data.items[0],
    },
    revalidate: 60,
  };
}

const Recipe = ({ recipe }: RecipePropType) => {
  const router = useRouter();

  console.log("recipe----", recipe);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>{recipe.fields.recipeTitle}</div>
      {recipe.fields.recipeImage && (
        <div>
          <Image
            src={recipe.fields.recipeImage}
            layout="intrinsic"
            width={500}
            height={500}
          />
        </div>
      )}
      <p>{recipe.fields.publishDate}</p>
      <p>{recipe.fields.category.fields.name}</p>
      {recipe.fields.author?.length && (
        <p>{recipe.fields.author[0]?.fields.name}</p>
      )}
      <Markdown>{recipe.fields.recipeDescription}</Markdown>
      {recipe.fields.tag?.map((t, i) => (
        <p key={t.sys.id}>{t.fields.name}</p>
      ))}
    </>
  );
};

export default Recipe;
