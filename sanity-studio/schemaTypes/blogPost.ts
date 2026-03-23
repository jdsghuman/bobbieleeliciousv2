import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({name: 'image', title: 'Main Image URL', type: 'url'}),
    defineField({
      // Markdown body — matches blog.fields.description used in ReactMarkdown
      name: 'description',
      title: 'Content (Markdown)',
      type: 'text',
      validation: (r) => r.required(),
    }),
    defineField({name: 'metaDescription', title: 'Meta Description', type: 'text'}),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'tag',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'image', date: 'publishDate'},
    prepare({title, media, date}) {
      return {title, media, subtitle: date ? new Date(date).toLocaleDateString() : ''}
    },
  },
  orderings: [
    {
      title: 'Publish Date, New',
      name: 'publishDateDesc',
      by: [{field: 'publishDate', direction: 'desc'}],
    },
  ],
})
