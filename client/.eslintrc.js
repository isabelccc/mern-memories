module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  parser: '@babel/eslint-parser',
  plugins: [
    'react',
    'react-hooks',
  ],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['@typescript-eslint', 'react-hooks'],
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'airbnb',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            ts: 'never',
            tsx: 'never',
            js: 'never',
            jsx: 'never',
          },
        ],
        'no-underscore-dangle': ['error', {
          allow: ['_id', '_d', '_dh', '_h', '_m', '_n', '_t', '_text'],
        }],
        'max-len': ['warn', { code: 120, ignoreUrls: true, ignoreStrings: true }],
        'object-curly-newline': 'off',
        'implicit-arrow-linebreak': 'off',
        'function-paren-newline': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'comma-dangle': ['error', {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'always-multiline',
        }],
      },
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: './tsconfig.json',
          },
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
      },
    },
  ],
  rules: {
    'import/extensions': 0,
    'react/prop-types': 0,
    'linebreak-style': 0,
    'react/state-in-constructor': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 'off', // Disabled - TypeScript handles this
    'react/button-has-type': ['error', {
      button: true,
      submit: true,
      reset: true,
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: ['event', 'e', 'req', 'res'],
    }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-alert': 'warn',
    'max-len': ['warn', { code: 120, ignoreUrls: true, ignoreStrings: true }],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: [
          '_d',
          '_dh',
          '_h',
          '_id',
          '_m',
          '_n',
          '_t',
          '_text',
        ],
      },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-curly-newline': 'off',
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/alt-text': 0,
    'jsx-a11y/no-autofocus': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: [
          'Link',
        ],
        specialLink: [
          'to',
          'hrefLeft',
          'hrefRight',
        ],
        aspects: [
          'noHref',
          'invalidHref',
          'preferButton',
        ],
      },
    ],
  },
};
