import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Seed files - console.log is acceptable for CLI utilities
    "prisma/seed*.ts",
  ]),
  // Custom stricter rules
  {
    rules: {
      // Prevent unused variables
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      // Require explicit return types on functions
      "@typescript-eslint/explicit-function-return-type": "off",
      // No console.log in production (allow warn/error)
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      // Prefer const over let when variable is never reassigned
      "prefer-const": "error",
      // No duplicate imports
      "no-duplicate-imports": "error",
      // Enforce consistent ordering of keys in objects
      "sort-keys": "off",
      // React hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // Next.js specific
      "@next/next/no-img-element": "warn",
    }
  }
]);

export default eslintConfig;
