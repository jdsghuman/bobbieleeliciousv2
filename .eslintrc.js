module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended', // Accessibility rules
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // This rule is not compatible with Next.js's <Link /> components
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    // needed for NextJS's jsx without react import
    'react/react-in-jsx-scope': 'off',
    // allow jsx syntax in js files (for next.js project)
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }], //should add ".ts" if typescript project
  },
  globals: {
    React: 'writable',
  },
  settings: {
    react: {
      version: 'latest',
    },
  },

  // module.exports =  {
  //   parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  //   extends:  [
  //     'plugin:react/recommended',  // Uses the recommended rules from @eslint-plugin-react
  //     'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
  //   ],
  //   parserOptions:  {
  //   ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
  //   sourceType:  'module',  // Allows for the use of imports
  //   ecmaFeatures:  {
  //     jsx:  true,  // Allows for the parsing of JSX
  //   },
  //   },
  //   rules:  {
  //     // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
  //     // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  //   },
  //   settings:  {
  //     react:  {
  //       version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
  //     },
  //   },
}
