import { GetStaticProps } from 'next'
import { getAllRecipes } from '../../lib/index'
import { HomePropType } from '../../components/PropTypes/PropTypes'
import FeatureList from '../../components/FeatureList/FeatureList'
import Subscribe from '../../components/Subscribe/Banner'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllRecipes()
  return {
    props: {
      recipes: posts.recipes,
    },
    revalidate: 180,
  }
}

const Recipes = ({ recipes }: HomePropType) => (
  <>
    <FeatureList title="Recipes" articles={recipes} slug="recipe" />
    <Subscribe />
  </>
)

export default Recipes
