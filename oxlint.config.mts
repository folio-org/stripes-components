import { defineLintConfig, lintConfig } from "@folio/eslint-config-stripes";

export default defineLintConfig({
  ...lintConfig,
  overrides: [
    ...(lintConfig.overrides ?? []),
    {
      // permit chai-style assertions, e.g. `expect(foo).to.be.true`
      files: ["**/tests/*-test.js"],
      rules: { 
        "no-unused-expressions": "off",
        "no-autofocus": "off",
      },
    },
  ],
});
