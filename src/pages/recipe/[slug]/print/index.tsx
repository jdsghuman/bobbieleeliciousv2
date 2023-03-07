import React, { useState } from 'react'
/* eslint-disable @next/next/no-img-element */
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AiOutlineClose } from 'react-icons/ai'
import { getAllPostsWithSlug, getPostBySlug } from '../../../../lib/index'
import { RecipePropType } from '@components/PropTypes/PropTypes'

import styles from '../../../../styles/Home.module.css'
import Button from '@components/Button'

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getAllPostsWithSlug('recipe')
  return {
    paths: data.items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostBySlug('recipe', params.slug)

  if (!post) {
    return { notFound: true }
  }

  return {
    props: {
      recipe: post,
    },
    revalidate: 200,
  }
}
const Print = ({ recipe }: RecipePropType) => {
  const router = useRouter()
  const [showImage, setShowImage] = useState<boolean>(true)

  console.log('recipe----', recipe)
  const goToHomePage = () => {
    router.pathname === '/' && window.location.reload()
  }

  const printPage = () => {
    window.print()
  }
  return (
    <div className={styles.print__container}>
      <Link href="/">
        <a>
          <img
            className={styles.print__logo}
            src="/images/bobbieleelicious-logo-black.png"
            alt={'Logo'}
          />
        </a>
      </Link>
      <div>
        <Button onClick={printPage} className={styles.print__button}>
          Print
        </Button>
      </div>
      <div>
        <h1 className={styles.print__title}>{recipe.fields.title}</h1>
        {showImage && (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <img
              src={recipe.fields.image}
              alt={recipe.fields.image}
              className={styles.print__image}
            />
            <AiOutlineClose
              onClick={() => setShowImage(false)}
              style={{ fontSize: '1.4rem', cursor: 'pointer' }}
            />
          </div>
        )}
      </div>
      <div className={styles.print__data}>
        <p style={{ margin: '4px' }}>
          <span style={{ fontWeight: 'bold' }}>Prep:</span> {recipe.fields.prep}
        </p>
        <p style={{ margin: '4px' }}>
          <span style={{ fontWeight: 'bold' }}>Cook Time:</span> {recipe.fields.cooktime}
        </p>
        <p style={{ margin: '4px' }}>
          <span style={{ fontWeight: 'bold' }}>Servings:</span> {recipe.fields.servings}
        </p>
      </div>
      <div>
        <h3
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: '2rem',
            marginBottom: '0',
            color: '#333',
          }}
        >
          Ingredients
        </h3>
        <ul style={{ listStyleType: 'square' }}>
          {recipe.fields.ingredients.split('--').map((ingredient, i) => (
            <li
              key={i}
              style={{
                fontSize: '1.2rem',
                fontFamily: 'Lato, sans-serif',
                fontWeight: 'lighter',
                marginBottom: '3px',
              }}
            >
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: '2rem',
            marginBottom: '0',
            color: '#333',
          }}
        >
          Directions
        </h3>
        <ol>
          {recipe.fields.recipeDirections.split('--').map((step, i) => (
            <li
              key={i}
              style={{
                fontSize: '1.2rem',
                fontFamily: 'Lato, sans-serif',
                fontWeight: 'lighter',
                marginBottom: '3px',
              }}
            >
              {step}
            </li>
          ))}
        </ol>
      </div>
      {recipe.fields.recipeNotes && (
        <div style={{ marginTop: '20px' }}>
          <h3
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: '2rem',
              color: '#333',
            }}
          >
            Recipe notes:
          </h3>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 'lighter' }}>
            {recipe.fields.recipeNotes}
          </p>
        </div>
      )}
      <div>
        <h3
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: '2rem',
            marginBottom: '200px',
            color: '#333',
          }}
        >
          Your notes:
        </h3>
      </div>
      <p>
        Link to recipe:{' '}
        <a
          href={`${router.basePath}/recipe/${recipe.fields.slug}`}
        >{`www.bobbieleelicious.com/recipe/${recipe.fields.slug}`}</a>
      </p>
    </div>
  )
}

export default Print
