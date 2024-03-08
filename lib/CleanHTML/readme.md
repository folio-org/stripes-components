## CleanHTML

For cases where presenting some user-provided markup is necessary, we need to ensure that that markup, before rendering it to the webpage, is free of any unexpected logic that could possibly be used for nefarious purposes (XSS attacks.)

This component should be used in any case where you need to use  `_dangerouslySetInnerHTML` or set markup via `innerHTML`.

Under the hood, this component makes use of the [`sanitize-html` library](https://github.com/apostrophecms/sanitize-html) and many of its props directly relate to its configuration properties.

For functional usage, we also supply a `sanitizeMarkup` function. Details below.

### Usage

```
<CleanHTML
  markup={possiblyBadMarkupContainingLinks}
  allowLinks
  containerProps={{ id: 'clean-html-test' }}
/>
```

### Component-specific props

prop | type | description | required
-- | -- | -- | --
`allowLinks` | bool | Whether to allow anchor (a) tags. Defaults to false. |
`allowSVG` | bool | Whether to allow SVG tags. Defaults to false. |
`containerProps` | object | HTML attributes to apply to the containing div. |
`markup` | string | The HTML content to be sanitized. |
`useSanitizeDefault` | bool | Whether to include sanitizeHTML defaults in the configuration. Defaults to true. |


### SanitizeHTML props...

We expose `sanitize-html` configuration properties via props. Values provided in these props will be concatenated onto `sanitize-html`'s default configurations unless `useSanitizeDefault={false}` is supplied. A list of the default values can be seen here: https://github.com/apostrophecms/sanitize-html?tab=readme-ov-file#default-options

prop | description
-- | --
`allowedTags` | Array of allowed tags
`nonBooleanAttributes` | Array of non-boolean HTML attributes to expect and allow.
`disallowedTagsMode` | How to handle violations. Default settings will remove offending tags entirely.
`allowedAttributes` |  Key-value mapping of tags to allowed attributes.
`selfClosing` | Array of self-closing tags to expect/accept.
`allowedSchemes` | Allowed URL schemes permitted in attributes excepting those (`href`, `src`, etc)
`allowedSchemesByTag` | Key-value mapping of tags to allowedSchemas.
`allowedSchemesAppliedToAttributes` | Specify attributes that will be parsed for `allowedSchemes`
`allowProtocolRelative` | Allow URL schemes starting with `//`. Defaults to `true`.
`enforceHtmlBoundary` | Should any characters outside of an `<html>` tag be discarded. Defaults to `true`.
`parseStyleAttributes` | Should `style` attributes be parsed.

### Stripes-supplied defaults

For the common use-case of some simply styled HTML, by default, we supply some minor additions to `sanitize-html`'s default settings:

```
const styledHTMLSettings = {
  allowedStyles: {
    '*': {
      'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/, /^[a-z]+$/],
      'text-align': [/^left$/, /^right$/, /^center$/],
      'padding': [/^\d+(?:px|em|%)$/],
      'font-size': [/^\d+(?:px|em|%)$/],
    },
  },
  allowedAttributes: {
    'p': ['style'],
    'div': ['style'],
    'a': ['style'],
    'span': ['style']
  }
};
```

### `sanitizeMarkup()`

```
sanitizeMarkup = (markup, options);
```

The keys for the options parameter are very similar to the props exposed by the `CleanHTML` component:

prop | type | description
-- | -- | --
`allowLinks` | bool | Whether to allow anchor (a) tags. Defaults to false. |
`allowSVG` | bool | Whether to allow SVG tags. Defaults to false. |
`includeDefaults` | bool | Whether to include sanitizeHTML defaults in the configuration. Defaults to `true`.
`config` | object | If `includeDefaults` is true, values provided in the `config` object will be merged/concatenated on top of the default `sanitize-html` configuration.



Example usage:
```
// add subset of configuration for SVG support.
sanitizeMarkup = (markup, { allowSVG: true });
// only allow '<p>' tags
sanitizeMarkup = (markup, { includeDefaults: false, config: { allowedTags: ['p'] }})
// allow links
sanitizeMarkup = (markup, { allowLinks: true });
```
