/**
 * Contentful → Sanity migration script (batched version)
 *
 * Usage:
 *   SANITY_TOKEN=your_token node scripts/migrate-to-sanity.mjs
 *
 * Place contentful-export.json in the project root before running.
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'

const SANITY_PROJECT_ID = 'avs8mde7'
const SANITY_DATASET = 'production'
const LOCALE = 'en-US'
const BATCH_SIZE = 50

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const CONTENT_TYPE_MAP = {
  blogPost: 'blogPost',
  blog: 'blogPost',
  recipe: 'recipe',
  Recipe: 'recipe',
  person: 'author',
  Person: 'author',
  categoryBlogs: 'category',
  categoryRecipes: 'category',
  category: 'category',
  tag: 'tag',
}

// Use Contentful ID as Sanity ID — avoids waiting for API responses to resolve references
const idMap = {}
const assetMap = {}

const f = (fields, key) => fields?.[key]?.[LOCALE]

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const fullUrl = url.startsWith('//') ? `https:${url}` : url
    const lib = fullUrl.startsWith('https') ? https : http
    lib.get(fullUrl, (res) => {
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

// Send documents to Sanity in batches to avoid timeouts
async function batchCreate(documents) {
  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE)
    const mutations = batch.map((doc) => ({ createOrReplace: doc }))
    await client.mutate(mutations)
    process.stdout.write(`  ${Math.min(i + BATCH_SIZE, documents.length)}/${documents.length}\r`)
  }
}

async function migrateAssets(assets) {
  console.log(`\nUploading ${assets.length} images to Sanity...`)
  for (const asset of assets) {
    const file = f(asset.fields, 'file')
    if (!file?.url) continue
    const url = file.url.startsWith('//') ? `https:${file.url}` : file.url
    const filename = path.basename(file.url.split('?')[0])
    try {
      const buffer = await downloadBuffer(url)
      const sanityAsset = await client.assets.upload('image', buffer, {
        filename,
        contentType: file.contentType,
      })
      assetMap[asset.sys.id] = sanityAsset._id
      console.log(`  Uploaded: ${filename}`)
    } catch (err) {
      console.error(`  Failed to upload asset ${asset.sys.id}: ${err.message}`)
    }
  }
}

// Images are plain URL strings (imgur), not Contentful assets
function resolveImage(imageField) {
  if (typeof imageField === 'string') return imageField
  return undefined
}

function resolveRef(ref) {
  const sanityId = idMap[ref?.sys?.id]
  if (!sanityId) return undefined
  return { _type: 'reference', _ref: sanityId }
}

async function migrateAuthors(entries) {
  const authors = entries.filter((e) => ['person', 'Person'].includes(e.sys.contentType.sys.id))
  console.log(`\nMigrating ${authors.length} authors...`)
  const docs = authors.map((entry) => {
    idMap[entry.sys.id] = entry.sys.id
    const fields = entry.fields
    return {
      _id: entry.sys.id,
      _type: 'author',
      name: f(fields, 'name'),
      title: f(fields, 'title'),
      shortBio: f(fields, 'shortBio'),
      image: resolveImage(f(fields, 'image')),
      email: f(fields, 'email'),
      phone: f(fields, 'phone'),
      company: f(fields, 'company'),
      website: f(fields, 'website'),
      facebook: f(fields, 'facebook'),
      instagram: f(fields, 'instagram'),
      twitter: f(fields, 'twitter'),
    }
  })
  await batchCreate(docs)
  console.log(`  Done.`)
}

async function migrateCategories(entries) {
  const categories = entries.filter((e) =>
    ['categoryBlogs', 'categoryRecipes', 'category'].includes(e.sys.contentType.sys.id)
  )
  console.log(`\nMigrating ${categories.length} categories...`)

  const seen = new Set()
  const docs = []
  for (const entry of categories) {
    const name = f(entry.fields, 'name')
    if (!name) continue
    // Deduplicate by name — categoryBlogs and categoryRecipes may share names
    if (seen.has(name)) {
      // Point duplicate Contentful IDs to the first entry's ID so references resolve
      const existing = docs.find((d) => d.name === name)
      if (existing) idMap[entry.sys.id] = existing._id
      continue
    }
    seen.add(name)
    idMap[entry.sys.id] = entry.sys.id
    docs.push({ _id: entry.sys.id, _type: 'category', name })
  }
  await batchCreate(docs)
  console.log(`  Done.`)
}

async function migrateTags(entries) {
  const tags = entries.filter((e) => e.sys.contentType.sys.id === 'tag')
  console.log(`\nMigrating ${tags.length} tags...`)
  const docs = tags
    .filter((entry) => f(entry.fields, 'name'))
    .map((entry) => {
      idMap[entry.sys.id] = entry.sys.id
      return { _id: entry.sys.id, _type: 'tag', name: f(entry.fields, 'name') }
    })
  await batchCreate(docs)
  console.log(`\n  Done.`)
}

async function migrateBlogPosts(entries) {
  const blogs = entries.filter((e) =>
    ['blogPost', 'blog'].includes(e.sys.contentType.sys.id)
  )
  console.log(`\nMigrating ${blogs.length} blog posts...`)
  const docs = blogs.map((entry) => {
    idMap[entry.sys.id] = entry.sys.id
    const fields = entry.fields
    const authorRef = f(fields, 'author')
    const categoryRef = f(fields, 'category')
    const tags = f(fields, 'tag') || []
    return {
      _id: entry.sys.id,
      _type: 'blogPost',
      title: f(fields, 'title'),
      slug: { _type: 'slug', current: f(fields, 'slug') },
      publishDate: f(fields, 'publishDate'),
      featured: f(fields, 'featured') ?? false,
      description: f(fields, 'description') || f(fields, 'body') || '',
      metaDescription: f(fields, 'metaDescription'),
      image: resolveImage(f(fields, 'image')),
      ...(authorRef?.sys?.id ? { author: resolveRef(authorRef) } : {}),
      ...(categoryRef?.sys?.id ? { category: resolveRef(categoryRef) } : {}),
      tag: tags
        .map((t) => resolveRef(t))
        .filter(Boolean)
        .map((ref) => ({ ...ref, _key: ref._ref.slice(0, 8) })),
    }
  })
  await batchCreate(docs)
  console.log(`\n  Done.`)
}

async function migrateRecipes(entries) {
  const recipes = entries.filter((e) =>
    ['recipe', 'Recipe'].includes(e.sys.contentType.sys.id)
  )
  console.log(`\nMigrating ${recipes.length} recipes...`)
  const docs = recipes.map((entry) => {
    idMap[entry.sys.id] = entry.sys.id
    const fields = entry.fields
    const authors = f(fields, 'author') || []
    const categoryRef = f(fields, 'category')
    const tags = f(fields, 'tag') || []
    return {
      _id: entry.sys.id,
      _type: 'recipe',
      title: f(fields, 'title'),
      slug: { _type: 'slug', current: f(fields, 'slug') },
      publishDate: f(fields, 'publishDate'),
      featured: f(fields, 'featured') ?? false,
      description: f(fields, 'description') || '',
      metaDescription: f(fields, 'metaDescription'),
      image: resolveImage(f(fields, 'image')),
      prep: f(fields, 'prep'),
      cooktime: f(fields, 'cooktime'),
      servings: f(fields, 'servings'),
      ingredients: f(fields, 'ingredients'),
      recipeDirections: f(fields, 'recipeDirections'),
      recipeNotes: f(fields, 'recipeNotes'),
      tools: f(fields, 'tools'),
      youtubeLink: f(fields, 'youtubeLink'),
      recipeInstagram: f(fields, 'recipeInstagram'),
      ...(categoryRef?.sys?.id ? { category: resolveRef(categoryRef) } : {}),
      author: authors
        .map((a) => resolveRef(a))
        .filter(Boolean)
        .map((ref) => ({ ...ref, _key: ref._ref.slice(0, 8) })),
      tag: tags
        .map((t) => resolveRef(t))
        .filter(Boolean)
        .map((ref) => ({ ...ref, _key: ref._ref.slice(0, 8) })),
    }
  })
  await batchCreate(docs)
  console.log(`\n  Done.`)
}

async function main() {
  if (!process.env.SANITY_TOKEN) {
    console.error('Error: SANITY_TOKEN environment variable is required.')
    process.exit(1)
  }

  const exportFile = path.join(process.cwd(), 'contentful-export.json')
  if (!fs.existsSync(exportFile)) {
    console.error('Error: contentful-export.json not found in project root.')
    process.exit(1)
  }

  console.log('Reading contentful-export.json...')
  const data = JSON.parse(fs.readFileSync(exportFile, 'utf-8'))
  const { entries = [], assets = [] } = data
  console.log(`Found ${entries.length} entries and ${assets.length} assets.`)

  await migrateAuthors(entries)
  await migrateCategories(entries)
  await migrateTags(entries)
  await migrateBlogPosts(entries)
  await migrateRecipes(entries)

  console.log('\nMigration complete!')
}

main().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
