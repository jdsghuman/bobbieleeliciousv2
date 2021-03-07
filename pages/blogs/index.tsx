import { GetStaticProps } from 'next'
import { getAllBlogs } from '../../lib/index'
import { HomePropType } from '../../components/PropTypes/PropTypes'
import FeatureList from '../../components/FeatureList/FeatureList'
import Subscribe from '../../components/Subscribe/Banner'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllBlogs()
  return {
    props: {
      blogs: posts.blogs,
    },
    revalidate: 180,
  }
}

const Blogs = ({ blogs }: HomePropType) => (
  <>
    <FeatureList title="Blogs" articles={blogs} slug="blog" />
    <Subscribe />
  </>
)

export default Blogs
