import js from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import next from "@next/eslint-plugin-next"

export default [
    js.configs.recommended,
    {
        files: ["src/**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                global: "readonly",
                module: "readonly",
                require: "readonly",
                exports: "readonly",
                fetch: "readonly",
                RequestInit: "readonly"
            }
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            react: react,
            "react-hooks": reactHooks,
            "@next/next": next
        },
        rules: {
            ...tseslint.configs.recommended[0].rules,
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            ...next.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_"
                }
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-require-imports": "off",
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "no-undef": "off", // TypeScript handles this
            "no-unused-vars": "off", // Use @typescript-eslint/no-unused-vars instead
            "no-extra-semi": "error",
            "no-redeclare": "error",
            "prefer-const": "error"
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },
    {
        ignores: [
            ".next/**",
            "node_modules/**",
            "dist/**",
            "build/**",
            "*.d.ts"
        ]
    }
]
