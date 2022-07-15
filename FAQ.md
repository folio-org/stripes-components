# Stripes-components FAQ
## Module developers
1. **Why should I use `stripes-components`?**

   Stripes-components sets foundation for a cohesive UI experience among all UI modules within the FOLIO ecosystem. It gives high importance to accessibility, adoption tenant-set themes, testability, and reuse across the board. Its goal is to facilitate module development with UI components that virtually snap together and provide the above functionalities as bonus.

2. **How do I find out what’s available in `stripes-components`?**

   There's a listing in the main readme here: [README.md](README.md)
To see components in action, our storybook can be run locally via the command
   ```
   yarn storybook
   ```
   from within your stripes-components folder.

3. **There’s a component that almost meets my needs, but not quite. What should I do?**

   1. Reach out to the core FOLIO team on Slack, or via a JIRA in the STCOM project at [issues.folio.org](https://issues.folio.org) We can make suggestions for alternative stripes-components or props that may need to be applied to achieve the necessary results.
   2. If your use-case cannot be solved with the current state of a component, the path forward is to create a PR for the change on the stripes-components repo. The change should meet the following criteria:
      1. Be mindful of accessibility in the rendered markup. Check out our [Accessibility guide](guides/AccessibilityDevPrimer.stories.mdx)
      2. Have additional tests written and passing. See our [Testing guide](guides/testing.stories.mdx)
      3. Be documented for other developers:
         * in the CHANGELOG.md
         * in the component's README.md if it affects the component's API or is noteworthy to future users of the components.
      4. Be in-line with [stripes-components style guidelines](guides/CSSinStripes.stories.mdx)


4. **There’s not a component that meets the use case I have. What should I do?**

    Ask the questions  a) Could the use case be solved with a composition of components? b) Could other FOLIO module developers benefit from the solution?
If only a is true, then the component could live/be exported within your own module, while using stripes components internally.
If both a and b are true, your idea might have a home here.
If only b is true, we may have a new component on our hands! Just follow similar steps as #3 - 1. Reach out 2. Propose new component in PR, meet the criteria.
