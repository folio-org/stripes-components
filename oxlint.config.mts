import { defineLintConfig as defineConfig, lintConfig } from "@folio/eslint-config-stripes";
export default defineConfig({ ...lintConfig,
  "overrides": [
    // chai has made some ... interesting decisions
    // don't panic when looking at these tests
    {
      "files": ["*-test.js"],
      "rules": {
        "no-unused-expressions": "off",
        "no-autofocus": "off",
        "no-unused-vars": "off",
      },
    }
  ],
  // don't lint out storybook stuff. storybook is bananas
  "ignorePatterns": ["lib/**/stories/**"],
});


