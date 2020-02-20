# Highlighter
Utility component to highlight words within a larger body of text.

## Basic Usage
```js
import { Highlighter } from '@folio/stripes/components';

<Highlighter
  searchWords={['walking', 'specification', 'frozen']}
  text="Walking on water and developing software from a specification are easy if both are frozen."
/>
```

## Props
Name | Type | Description | Required
-- | -- | -- | --
autoEscape | bool | Escape characters in `searchWords` which are meaningful in regular expressions |
className | string | Applies a class name on the wrapper element |
highlightClassName | string | Updates the highlight class name to enable custom styling of marked text |
searchWords | array | Array of search words. String search terms are automatically cast to RegExps unless `autoEscape` is true. | true
sanitize | func | Process each search word and text to highlight before comparing (eg remove accents); signature (text: string): string |
style | object | Applies a style attribute on the wrapper element |
text | string | Text to highlight matches in | true

