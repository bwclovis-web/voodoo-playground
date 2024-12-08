/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  ignorePatterns: ["!**/.server", "!**/.client"],
  extends: ["eslint:recommended", "plugin:storybook/recommended"],
  overrides: [
    // React
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      plugins: ["react", "jsx-a11y", "@stylistic", "import"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
      ],
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
        "import/resolver": {
          typescript: {},
        },
      },
      rules: {
        "@stylistic/jsx/curly-newline": ["error", "always"],
      }
    },
    // Typescript
    {
      files: ["**/*.{ts,tsx,mjs}"],
      plugins: ["@typescript-eslint", "import", "@stylistic"],
      parser: "@typescript-eslint/parser",
      settings: {
        "import/internal-regex": "^~/",
        "import/resolver": {
          node: {
            extensions: [".ts", ".tsx"],
          },
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
      ],
      rules: {
        "arrow-body-style": ["error", "as-needed"],
        "camelcase": ["error", { properties: "always", ignoreDestructuring: true }],
        complexity: ["error", 6],
        "curly": "error",
        "default-case": "error",
        "default-case-last": "error",
        "default-param-last": "error",
        "dot-notation": "error",
        "eqeqeq": "error",
        "func-names": ["error", "as-needed"],
        "func-style": ["error", "declaration", { "allowArrowFunctions": true }],
        "guard-for-in": "error",
        "id-denylist": ["error", "callback"],
        "id-length": ["error", { "min": 3, "max": 40, "properties": "never", "exceptions": ["_", "__", "i", "j", "fs", 't', 'to'] }],
        "import/order": ["error",
          {
            alphabetize: { caseInsensitive: true, order: "asc" },
            groups: ["builtin", "external", "internal", "parent", "sibling"],
            "newlines-between": "always",
          },
        ],
        "max-depth": ["error", 2],
        "max-nested-callbacks": ["error", 3],
        "max-params": ["error", 4],
        "max-statements": ["error", 7],
        "new-cap": ["error", {"newIsCap": true, "capIsNew": true }],
        "no-console": "error",
        "no-empty": "error",
        "no-empty-function": ["error", { "allow": ["constructors"] }],
        "no-template-curly-in-string": "error",
        "no-undef-init": "error",
        "no-var": "error",
        radix: "error",
        semi: ["error", "never"],
        "sort-imports": ["error", { "ignoreDeclarationSort": true, "allowSeparatedGroups": true  }],
        "sort-keys": "error",
        "one-var": ["error", "never"],
        "vars-on-top": "error",
        yoda: "error",

        //Stylistic
        "array-bracket-newline": ["error", { "multiline": true, "minItems": 4 }],
        "array-bracket-spacing": ["error","always", { "singleValue": true, "objectsInArrays": false, "arraysInArrays": false }],
        "array-element-newline": ["error", "consistent"],
        "arrow-parens": ["error", "as-needed"],
        "arrow-spacing": "error",
        "block-spacing": "error",
        "brace-style": "error",
        "comma-dangle": ["error", "never"],
        "comma-spacing": "error",
        "computed-property-spacing": ["error", "never"],
        "dot-location": ["error", "property"],
        "eol-last": ["error", "always"],
        "@stylistic/function-call-spacing": ["error", "never"],
        "function-call-argument-newline": ["error", "consistent"],
        "function-paren-newline": ["error", "multiline"],
        "generator-star-spacing": ["error", "after"],
        "implicit-arrow-linebreak": ["error", "beside"],
        "key-spacing": ["error", {
          "beforeColon": false,
          "afterColon": true,
          "mode": "strict",
        }],
        "keyword-spacing": ["error", { "after": true, "before": true }],
        "lines-around-comment": ["error", { "beforeBlockComment": true }],
        "lines-between-class-members": ["error", "always"],
        "max-len": ["error", { "code": 80, "ignoreUrls": true, "ignoreStrings": true, "ignoreTemplateLiterals": true }],
        "template-tag-spacing": ["error", "always"],
        "@stylistic/type-annotation-spacing": ["error", { "before": false, "after": true }],
        "@stylistic/type-generic-spacing": ["error"],
        "@stylistic/type-named-tuple-spacing": ["error"],
        "wrap-iife": ["error", "inside"],
        "wrap-regex": "error"
      }
    },

    // Node
    {
      files: [".eslintrc.cjs"],
      env: {
        node: true,
      },
    },
  ],
};
