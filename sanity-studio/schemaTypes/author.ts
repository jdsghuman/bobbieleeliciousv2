import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'shortBio', title: 'Short Bio', type: 'text'}),
    defineField({name: 'image', title: 'Image URL', type: 'url'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'company', title: 'Company', type: 'string'}),
    defineField({name: 'website', title: 'Website', type: 'url'}),
    defineField({name: 'facebook', title: 'Facebook', type: 'url'}),
    defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
    defineField({name: 'twitter', title: 'Twitter', type: 'url'}),
  ],
  preview: {
    select: {title: 'name', media: 'image'},
  },
})
