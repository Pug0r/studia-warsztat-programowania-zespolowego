module.exports = {
  root: true,
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.vite/**",
    "**/*.d.ts",
  ],
  overrides: [
    {
      files: ["backend/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./backend/tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
      env: {
        node: true,
        es2022: true,
      },
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/consistent-type-imports": "warn",
      },
    },
    {
      files: ["frontend/**/*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: [
          "./tsconfig.json",
          "./frontend/tsconfig.json",
          "./backend/tsconfig.json",
        ],
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      env: {
        browser: true,
        es2023: true,
      },
      plugins: ["@typescript-eslint", "react-hooks", "react-refresh"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:react-hooks/recommended",
      ],
      rules: {
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
        "@typescript-eslint/no-misused-promises": [
          "error",
          { checksVoidReturn: { attributes: false } },
        ],
      },
    },
    {
      files: ["**/*.{js,cjs,mjs}"],
      env: {
        node: true,
        es2022: true,
      },
      extends: ["eslint:recommended"],
    },
  ],
};
