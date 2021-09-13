## Accessibility primer for developers

Accessibility and inclusive design mean that no permissable user is excluded from accessing data or performing tasks through a user interface. Any subjective design decision has potential to exclude users from functionality, but awareness of best accessibility practices can help filter out inaccessible approaches up front. It's a larger effort to make inaccessible code accessible after the fact.

Adding inclusive design expands the typical accessibilty scope beyond assistive technology("A-T", aka screen readers) and includes format ideas like smaller screen sizes or touch displays.

Empathy is key when developing accessible applications. Imagine if the only way you had to experience the web is to have it read to you - the text of every button, link, and form input - and you could never see the entirety of the page all at once. That's the limited experience of using a screen reader in a nutshell.

Modern web development gives us a wholesome set of tools to control the way that a webpage interacts with assistive tech.

### Development checklist.
Each link within this list is a link to part of this document.

- [ ] Use appropriate [semantic tags](#html5-semantic-tags-roles-and-aria) instead of generic `<div>`s and `<span>`s.

- [ ] Keep any user aware of status/context. Be sure that changes to the page are relayed appropriately to screen readers via [focus management](#focus-management) or other means of [relaying messages](#relaying-status-with-aria-live-regions).

- [ ] Don't rely on hover effects to relay important info. Avoid using [title attributes](#title-attributes). The `<Tooltip>` component can be used to supply a hover functionality in an accessible way.

- [ ] Keep the application usable via keyboard only. Use [tabIndex = "-1"](#tabindex) and [focus-management](#focus-management) to keep keyboard navigation efficient.

- [ ] All form controls should be [Labeled appropriately](#labeling). Redundant labeling should be removed.

- [ ] Ensure adequate [color contrast](#color) ratios for styles and be sure that any meaningful color is accompanied by text that also relays the meaning.

### HTML5 semantic tags, roles, and ARIA.
Tags such as `<header>`, `<nav>` and `<dialog>` invoke special behaviors with assistive technology as opposed to their generic counterparts (`<div>` and `<span>`.) When the content of these semantic elements is initially focused, screen readers will specifically announce them, saying 'header', 'navigation', 'dialog' respectively and give AT users context about where their focus/cursor is located within the body of the page. See [W3Schools Semantic Elements](https://www.w3schools.com/html/html5_semantic_elements.asp) for a nice reference list of available tags.

In situations where semantic tagnames are inadequate, the `role` attribute can be used, but care must be taken to ensure that familiar functionality does carry over.
**The `role` attribute is like a contract with the screen reader, promising that all the functionality it would normally have from the semantic element is present on the element receiving the role.** For example, `role="button"` makes the promise that an element handles clicks as well as keyboard presses when it is in focus. ARIA (Accessible Rich Internet Applications) attributes are a third layer of control over how screen readers announce a webpage. Both semantic tags and 'role's essentially apply `aria-` attributes under the hood.

[WAI-ARIA Best practices](https://www.w3.org/TR/wai-aria-practices/#intro) is a great resource for patterns and implementations regarding use of `aria-` attributes, `role`s and semantics.

The ultimate fallback for compound component development is `aria-` attributes. These are necessary to relay state accurately and will have to be manipulated via Javascript. Our components nicely encapsulate these behaviors, so you won't need to worry about manually setting these up very often.

You can view a list of roles with details and requirements here: [MDN - Using ARIA: Roles, States and Properties](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)

### Focus management
Focus is "the cursor" of a web page. When your cursor appears within and you can enter text into an input, that input is said to be 'in focus'. Using the "Tab" key on the keyboard to navigate the fields in a form is effectively moving the focus.

A-T users rely on focus and the related text within the mark-up to have context and understand relationships between elements of the page. It's their **very** narrow field of 'vision' in most circumstances - a tiny raft in a vast ocean (of divs!). Moving the focus of the page via Javascript is one technique for keeping the user aware of page/content changes.

Modal pop-ups (`<dialog>` element!), for example, must move focus to their contents so that the user can carry out activity there. If focus doesn't move, the user has to arrow/tab through the lenghty content of the page to find the modal, or worse - they have no idea that the modal has even appeared.

After a user has finished working within the modal, focus should travel back/close to the place it was prior to the appearance of the modal. This gives the user a comfortable sequence of navigation around the page.

Programmatic focus changes should only happen **after a user triggers them**. As a rule, focusing one element should not cause focus to move to another([3.2.1](https://www.w3.org/TR/WCAG21/#on-focus)).

In ReactJS, focus can be managed via `ref`s to DOM elements. In this contrived example, an element is programmatically focused by calling the element's `focus()` method via the ref:
```
this.addButton = react.createRef();

focusAddButton = () => {
  if (this.addButton.current) {
    this.addButton.current.focus();
  }
}

render() {
  return (
  <>
    <Button onClick={this.focusAddButton}>Focus Add Button</Button>
    <Button tabIndex="-1" ref={this.addButton}>Add item</Button>
  </>
}
```

#### TabIndex
HTML elements have a `tabindex` or (or `tabIndex` in React) that will set its position in document tab order - the order elements are focused in when the user moves focus using the "Tab" key. All `tabIndex="0"` are focused on the first pass, the `tabIndex="1"` and so on... Best practices dictate to never set tab-index above "0" as it can cause elements to be communicated out-of-order. Interactive elements like `<button>` and `<input>` have `tabIndex="0"` set by default.

`tabIndex="-1"` means that the element is only focusable via javascript. If an element is only meant to be focused by client side code, and not part of a user's keyboard navigation, use `tabIndex = "-1"`. 

### Color
Color is a great tool for meaning - but it should never be the *only* indicator of meaning. Color should always be used in conjunction with text - even in the verbiage of a page. **Bad**: "Press the blue button" **Good**: "Press the blue 'Submit' button."

Color contrast is an important aspect to ensure that the webpage is legible, even for users with color-blindness or other sight disabilities. WCAG 2.0 AA standard requires that elements on a page have a sufficient color contrast of 4.5:1 for normal text and 3:1 for large or bold text.([1.4.3](https://www.w3.org/TR/WCAG21/#contrast-minimum)) Check out the links below for a color contrast checking tool.

**Known false positive**:  When the contrast checker tool checks the icons which have a default/placeholder background color and a text color with no visible text – it's only rendering an icon, so there's no issue.

### Labeling
Form controls require associated labels so that AT can convey the purpose of a text field, select box, radio-button, etc.([1.3.5](https://www.w3.org/TR/WCAG21/#identify-input-purpose)) While our components do encapsulate numerous accessibility features, labeling is one aspect where options are preserve due to the variance in techniques.

Typical labeling of form elements is as follows (explicit labeling) our form controls set these up under the hood:
```
<!-- general html controls -->
<label for="inputid">username</label>
<input type="text" id="inputid" />

<!-- stripes-components controls -->
<TextField label="username" />
```

Given this, a screen reader will announce 'username edit blank' when the user tabs to the field. Without the `<label>`, it simply announces 'edit blank'.

If visible labels are inadequate, `aria-label` can be used:
```
<!-- general html controls -->
<input type="text" aria-label="username" id="inputid" />

<!-- stripes-components controls -->
<TextField aria-label="username" />
```
If the label is visible elsewhere in the page, its element can be associated with the input via `aria-labelledby`: 
```
<!-- general html controls -->
<div id="columnlabel">starting date</div>
...
<input type="text" aria-labelledby="columnlabel" />

<!-- stripes-components controls -->
<TextField aria-labelledby="columnlabel" />
```

Although form controls are a primary place where `aria-` attributes can be used, just about any focusable element can have a `aria-` labeling applied. 

These are powerful accessibility tools, but they should be used with care. Over/improper usage can lead to redundant screen reader announcements. This is considered a flaw and should be avoided. Imagine someone's reading a navigation to you and they read every label twice.

#### Title attributes
It is not uncommon for `title` attributes to be used and considered 'handy' for their hover effects. Not only is it bad practice to hide important instructions in these attributes due to dependance on hover/mouse support, `title` can cause redundant announcement of labels if they're used with any other method of labeling. It's best to be avoided and its intended result can be achieved to other means in most cases.

#### Label precedence
`aria-labelledby` takes precedence over `aria-label` as well as an explicit/visible text label. Elements can be over-labeled. 

In the following contrived example, we might have wanted the label to be 'username' - but the `<label>` element will be ignored despite its explicit relationship, as well as the `aria-label` attribute.
The content of the `<span #label-elem>` will be announced, as well as the `title`. Focusing this input using NVDA will announce 'label element edit title name, blank'.
```
<span id="label-elem">label element</span>
<TextField
  label="username"
  id="precedence-input"
  aria-label="aria name"
  title="title name"
  aria-labelledby="label-elem"
/>
```
Best advice is to only use a single labeling technique at a time.

### Descriptive text
Another attribute is `aria-describedby`. It can be used to relate helpful text or instructions to an element. It will not overwrite a label. Since the way this is implemented in screen readers can vary - sometimes its automatically announced, sometimes not - it should be kept as brief as possible.

### Relaying status with aria-live regions
A key principle of accessibility for screen readers is to keep the user aware of changes to the page. Screen reader users cannot see the entire page at once, so they could trigger actions causing updates and be left unaware of the visual alert that's appearing or that page transitioned to a different step in the workflow. `Aria-live` regions help to resolve this. A-T will announce the contents of an `<div aria-live="assertive"></div>` when the contents are changed, despite the focus/cursor of the web page being elsewhere. For sake of compatibility, it is best that the container exist before announcements are added into it. If an `aria-live` div is rendered with an error message at the same time, the message may go unnoticed/unannounced.

The `aria-live` attribute has two possible settings: `assertive` and `polite`. `assertive` is for priority messages - it interrupts anything the screen reader may currently be announcing. `polite` waits until the screen reader is finished with its current announcement before relaying the message. `role=alert` is the `role` equivalent for `aria-live="assertive"`.

The `<SRStatus>` component is our defacto `aria-live` region component for screen-reader-only messages.

Our `<MessageBanner>` component sets up an `aria-live` under the hood.

Form element components use `role="alert"` for form validation messages.

See [WAI ARIA Spec: aria-live](https://www.w3.org/TR/wai-aria-1.1/#aria-live) for more details.

### Document structure
The ideal document structure, at the very least, has headers nested by their level (rank). 
```html static
<H1>
  <H2>
    <H3>
  <H2>
    <H3>
      <H4>
    <H3>
```
Assistive technology allows users to navigate from one header to the next. Scanning headers is one of the first steps a screen reader user may take when they're getting acquainted with the markup of a page.
Know that semantic landmark `<section>` can restart the heading rank order...
```
<section>
  <H2> I'm an h2, but I'm considered an H1 due to the section tag </H2>
</section>
```
Other semantic tags are useful for relaying the location of the user's cursor if not conveniently navigable via AT shortcuts.

The FOLIO UI sets up a rank-nested header by default.
- h1: the main navigation heading
- h2: each `<Pane>` header.
` h3: each `<Accordion>` header.

Each heading nested within this should be h4-h6.

### Showing/hiding content
Sometimes content we need to relay to a screen reader that may be destracting or noisy to sighted users. Sometimes visible content may be completely overwhelming for AT users to digest. In these instances, attributes that provide show/hide functionality come in very handy.

| language | attribute/property | visual display | screen-reader
| :--- | :--- | :--- | :---
| HTML | `aria-hidden` | displayed | hidden
| HTML | `hidden` | hidden | hidden
| HTML | className="sr-only" | hidden | announced
| CSS | `display: none` | hidden | hidden
| CSS | `visibility: hidden` | hidden | hidden
| HTML | `aria-disabled` | displayed | hidden

### Handy browser extenstions:
- [Axe](https://chrome.google.com/webstore/detail/axe-web-accessibility-tes/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US)- handy Chrome extension for static analysis.
- [Accessibility Insights for Web](https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni)- Tab stop visualization, heading analysis, landmark analysis among other useful tools.
- [WCAG color contrast checker](https://chrome.google.com/webstore/detail/wcag-color-contrast-check/plnahcmalebffmaghcpcmpaciebdhgdf)
- [HTML5 Outliner](https://chrome.google.com/webstore/detail/html5-outliner/afoibpobokebhgfnknfndkgemglggomo?hl=en)- can be used to see if your landmark elements/headers are set up correctly. Not unlike similar tools used by screen readers.

### Screen readers
- [NVDA](https://www.nvaccess.org/download/) Free for use and testing.
- [JAWS](https://support.freedomscientific.com/Downloads/JAWS) Demo works in 40 minute mode (requires restart after 40 minutes.)

