export interface BlogsPropType {
  fields: {
    slug: string;
    title: string;
    heroImage: Object;
    description: string;
    body: string;
    author: Object;
    publishDate: string;
    tags: Array<string>;
  };
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
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
    slug: string;
    recipeTitle: string;
    featured: boolean;
    publishDate: string;
    recipeDescription: string;
    recipeImage: string;
    category: {
      fields: {
        name: string;
      };
    };
    tag: Tag[];
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
  };
  sys: {
    id: string;
  };
}

interface CategoryPropType {
    fields: {
        name: string;
    }
    sys: {
     id: string;   
    }
}

export interface RecipePropType {
  recipe: {
    fields: {
      author: AuthorPropType[];
      category: CategoryPropType;
      slug: string;
      recipeTitle: string;
      featured: boolean;
      publishDate: string;
      recipeDescription: string;
      recipeImage: string;
      tag: Tag[];
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
