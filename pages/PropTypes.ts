export interface BlogsPropType {
  fields: {
    author: AuthorPropType;
    blogImage: string;
    body: string;
    description: string;
    featured: boolean;
    publishDate: string;
    slug: string;
    tag: Tag[];
    title: string;
  };
  sys: {
    id: string;
  };
}

interface Tag {
  fields: {
    name: string;
  };
  sys: {
    id: string;
  };
}

interface RecipesPropType {
  fields: {
    author: AuthorPropType[];
    category: CategoryPropType;
    cooktime: string;
    featured: boolean;
    ingredients: string;
    prep: string;
    publishDate: string;
    recipeDescription: string;
    recipeDirections: string;
    recipeImage: string;
    recipeInstagram: string;
    recipeNotes: string;
    recipeTitle: string;
    recipeYoutubeLink: string;
    servings: string;
    slug: string;
    tag: Tag[];
    tools: string;
  };
  sys: {
    id: string;
  };
}

interface AuthorPropType {
  fields: {
    company: string;
    email: string;
    facebook: string;
    image: string;
    instagram: string;
    name: string;
    phone: string;
    shortBio: string;
    title: string;
    twitter: string;
    website: string;
  };
  sys: {
    id: string;
  };
}

interface CategoryPropType {
  fields: {
    name: string;
  };
  sys: {
    id: string;
  };
}

export interface RecipePropType {
  recipe: {
    fields: {
      author: AuthorPropType[];
      category: CategoryPropType;
      cooktime: string;
      featured: boolean;
      ingredients: string;
      prep: string;
      publishDate: string;
      recipeDescription: string;
      recipeDirections: string;
      recipeImage: string;
      recipeInstagram: string;
      recipeNotes: string;
      recipeTitle: string;
      recipeYoutubeLink: string;
      servings: string;
      slug: string;
      tag: Tag[];
      tools: string;
    };
    sys: {
      id: string;
    };
  };
  morePosts?: Array<any>;
}

export interface BlogPropType {
  blog: {
    fields: {
      author: AuthorPropType;
      blogImage: string;
      body: string;
      description: string;
      featured: boolean;
      publishDate: string;
      slug: string;
      tag: Tag[];
      title: string;
    };
    sys: {
      id: string;
    };
  };
}

export interface HomePropType {
  blogs: BlogsPropType[];
  recipes: RecipesPropType[];
}
