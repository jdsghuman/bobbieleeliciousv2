import React, { useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AiOutlineClose, AiOutlinePrinter } from 'react-icons/ai'
import { getAllPostsWithSlug, getPostBySlug } from '../../../../lib/index'
import { RecipePropType } from '@components/PropTypes/PropTypes'
import { RobotsContent } from '@components/PropTypes/Tags'

import styles from '../../../../styles/Home.module.css'
import Button from '@components/Button'
import Spinner from '@components/Spinner'

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getAllPostsWithSlug('recipe')
  return {
    paths: data.items.map((item) => ({
      params: { slug: item.fields.slug },
    })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostBySlug('recipe', params?.slug)

  if (!post) {
    return { notFound: true }
  }

  return {
    props: {
      recipe: post,
    },
    revalidate: 86400,
  }
}
const Print = ({ recipe }: RecipePropType) => {
  const router = useRouter()
  const [showImage, setShowImage] = useState<boolean>(true)

  const printPage = () => {
    window.print()
  }

  if (router.isFallback) {
    return <Spinner />
  }

  if (!recipe) {
    return <Spinner />
  }

  const canonicalUrl = `https://www.bobbieleelicious.com/recipe/${recipe.fields.slug}`

  return (
    <>
      <Head>
        <meta name="robots" content={`${RobotsContent.no_index},${RobotsContent.follow}`} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <div className={styles.print__container}>
        <Link href="/" passHref prefetch={false}>
          <Image
            className={styles.print__logo}
            src="/images/bobbieleelicious-logo-black.png"
            alt={'Logo'}
            width={200}
            height={75}
          />
        </Link>
        <div>
          <Button onClick={printPage} type="button" className={styles.print__button}>
            <AiOutlinePrinter className={styles.print__icon} />
            Print
          </Button>
        </div>
        <div>
          <h1 className={styles.print__title}>{recipe.fields.title}</h1>
          {showImage && (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Image
                src={recipe.fields.image}
                alt={recipe.fields.image}
                className={styles.print__image}
                width={200}
                height={200}
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
    </>
  )
}

export default Print
