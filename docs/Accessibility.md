# Accessibility in Stripes

Accessibility involves the navigability, legibility, and general usability of the web application. Conversations around accessibility typically involve the engagement of users that have impaired vision, motor-skills or a learning disability, but it can have great and positive impact on the experience of fully capable users as well. Much of the time it involves how assistive technology (screen readers, etc.) interact with the content of the web page - but other areas involve the color contrast of styling, font choices/sizes, lack of input segregation (mouse vs touch vs keyboard-only navigation).

## Components to the rescue!

Ensuring that your web application meets accessibility standards can be a daunting task for developers. Code-wise, it includes semantic html tags  and attributes that can make very little difference for sighted users, but the impact for those depending on screen-readers or other assistive technology is massive. React components allow for us to re-use packaged up code - so all of the tags and attributes are actually coded in one place and rendered accordingly through the API surface of props for each instance of a component. A great deal of accessible mark-up is already written for you, and props can be a great deal more digestible than if you had to write all of the html-attributes and tags yourself. Form elements, for example:
An accessible form text input, in raw HTML:
```
<label for="nameInput">Name</label>
<input type="text" id="nameInput" name="personal.name" />
```
vs the same input via a component
```
<TextField id="nameInput" label="Name" name="personal.name" />
```
This simple example shows both the code reduction that components provide and the simplification of the API surface. If both an `id` and a `label` prop are supplied to the `<TextField>` component, then the component takes care of rendering the `<label>` tag, assigning the `id` to the text input, and connecting them via the `for` attribute (or `htmlFor`, in React-speak). When a user of a screen reader focuses the input, the text of the label will be read aloud to them along with any value present in the field.

## Page structure

The Stripes UI takes advantage of semantic tagging and hierarchical heading structure to support "Outline-able" modules. Assistive technology can arrange page content navigation in an outline according to its heading levels. A user of NVDA (free screen reader: https://www.nvaccess.org/) can use the "H" key on their keyboard to move to the next header in their page's structure, complete with announcement of the heading level. Placing heading levels out of numerical order (e.g. using an `<h3>` after an `<h1>`) can cause issues with the outlining functionality which makes page content more difficult to navigate. The hierarchy of a FOLIO ui application begins with an `<h1>` in the top menu bar of the application and continues through to `<h2>`s within pane headers, and `<h3>`s on `<Accordion>`s - the standard component for content sections. Additionally, we include a `<Headline>` component that can render `<h1-h6>` tags with easy styling via props for system-established `size` and `margin` settings. `<section>` tags are a standard part of HTML5 and should be use to create other sections of content if an `<Accordion>` cannot be used, for some reason. Often, proper heading structure is shied away from because the sheer size of the text within a heading can be aesthetically disruptive. Given the mentioned props, that is not an issue with `stripes-components`.

## Programmatic legibility

Screen-readers are computer programs that, as their title suggests, read the textual content of the screen aloud to users with sight disabilities. They only see textual content - and any visual content is lost to them without supplying additional text for audible announcement. Imagine having to rely on someone else to read the text of a web page aloud to you, without them being able to verbally describe icons, colors and pictures based on what they're seeing on the screen if the text is not present anywhere. When you're creating a UI that works with a screen-reader, that's precisely the situation you're preparing for. Fear not! The packaged semantic tags, `roles`, and `aria-attributes` within components are there to do the heavy lifting! If all else would fail with mark-up, it's possible to use our screen-reader-specific component `<SRStatus>` to send a string that will be read aloud by the screen-reader.

## Keyboard Navigation

Productivity is key. The UI that allows users to work faster and increase efficiency will win the hearts of users - with or without any impairments (and their bosses hearts as well!) Many users make the conscious decision to use keyboard rather than the mouse for the sheer speed. The time it takes to move a mouse pointer from one target area to another can make quite a difference. Web users interact with web pages via the `tab`, `enter`, `spacebar` and `arrow` keys. Users of screen-readers have additional hotkeys that they can take advantage of to navigate between the headings (`<h1-6>`), list items (`<li>`), links and buttons of a page. Stripes components strive for full keyboard support with very little overhead - another aspect of ui-development that can be quite time-consuming if it has to be coded from scratch. If more specific control is necessary for custom components, we use `stripes-react-hotkeys` to provide custom hotkey set-ups, with exposeable actions that can be set at higher levels in the UI.

## Focus Management

Focus is the key to the context of assistive technology. The focused element can be the text-input where a user is entering a value, a highlighted radio-button, or an outlined link that's awaiting a press of the enter key to help the user travel to another page. Stripes-components manage focus where necessary, making assurance that the User's focus indicator is where it needs to be when it needs to be there. Triggered actions might move focus to a different control on the page to save the user from having to navigate across numerous tabbable elements to get to the location in the UI where a change needs to be made. `<FocusLink>` is a component that can be used to make sections of content "skip-able" if so desired. This works well for skipping sets of filters after a search field and shifting focus directly to the results listing.
