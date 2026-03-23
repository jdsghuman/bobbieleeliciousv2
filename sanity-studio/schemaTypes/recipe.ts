import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'recipe',
  title: 'Recipe',
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
      // Markdown intro — matches recipe.fields.description used in ReactMarkdown
      name: 'description',
      title: 'Description (Markdown)',
      type: 'text',
      validation: (r) => r.required(),
    }),
    defineField({name: 'metaDescription', title: 'Meta Description', type: 'text'}),

    // Recipe metadata
    defineField({name: 'prep', title: 'Prep Time', type: 'string'}),
    defineField({name: 'cooktime', title: 'Cook Time', type: 'string'}),
    defineField({name: 'servings', title: 'Servings', type: 'string'}),

    defineField({
      // Items separated by "--" — matches how RecipeController splits them
      name: 'ingredients',
      title: 'Ingredients (separate each with --)',
      type: 'text',
    }),
    defineField({
      // Items separated by "--" — matches how RecipeController splits them
      name: 'recipeDirections',
      title: 'Directions (separate each with --)',
      type: 'text',
    }),
    defineField({name: 'recipeNotes', title: 'Recipe Notes', type: 'text'}),
    defineField({name: 'tools', title: 'Tools (Markdown)', type: 'text'}),
    defineField({name: 'youtubeLink', title: 'YouTube Link', type: 'url'}),
    defineField({name: 'recipeInstagram', title: 'Instagram Link', type: 'url'}),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'author'}]}],
      validation: (r) => r.required().min(1),
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
