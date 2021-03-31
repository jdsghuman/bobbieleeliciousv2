export interface BlogsPropType {
  fields: {
    author: AuthorPropType
    image: string
    body: string
    category: CategoryPropType
    description: string
    featured: boolean
    publishDate: string
    slug: string
    tag: TagPropType[]
    title: string
    metaDescription: string
  }
  sys: {
    id: string
    contentType: {
      sys: {
        id: string
      }
    }
  }
}

export interface BlogPropType {
  blog: BlogsPropType
  morePosts?: Array<any>
}

export interface TagPropType {
  fields: {
    name: string
  }
  sys: {
    id: string
  }
}

export interface RecipesPropType {
  fields: {
    author: AuthorPropType[]
    category: CategoryPropType
    cooktime: string
    featured: boolean
    ingredients: string
    prep: string
    publishDate: string
    description: string
    recipeDirections: string
    image: string
    recipeInstagram: string
    recipeNotes: string
    title: string
    youtubeLink: string
    servings: string
    slug: string
    tag: TagPropType[]
    tools: string
    metaDescription: string
  }
  sys: {
    id: string
    contentType: {
      sys: {
        id: string
      }
    }
  }
}

export interface RecipePropType {
  recipe: RecipesPropType
  morePosts?: Array<any>
}

interface AuthorPropType {
  fields: {
    company: string
    email: string
    facebook: string
    image: string
    instagram: string
    name: string
    phone: string
    shortBio: string
    title: string
    twitter: string
    website: string
  }
  sys: {
    id: string
  }
}

interface CategoryPropType {
  fields: {
    name: string
  }
  sys: {
    id: string
  }
}

export interface HomePropType {
  blogs: BlogsPropType[]
  recipes: RecipesPropType[]
  featuredPosts: Array<any>
}

export interface IconPropType {
  fill?: string
  link?: string
  position?: string
  className?: string
  viewBox?: string
}
