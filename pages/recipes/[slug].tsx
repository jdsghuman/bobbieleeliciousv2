import Markdown from "markdown-to-jsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { RecipePropType } from "../PropTypes";
import { getAllPostsWithSlug, getPostBySlug, getMorePosts } from '../../lib/index'

export async function getStaticPaths() {
  const data = await getAllPostsWithSlug('recipe')

  return {
    paths: data.items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug('recipe', params.slug)
  const morePosts = await getMorePosts('recipe', params.slug)
  return {
    props: {
      recipe: post,
      morePosts: morePosts ? morePosts : null,
    },
    revalidate: 60,
  };
}

const Recipe = ({ recipe, morePosts }: RecipePropType) => {
  const router = useRouter();

  console.log("recipe----", recipe);
  console.log("morePosts----", morePosts);

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
