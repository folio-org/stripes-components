# MetaSection
Component for displaying record metadata such as the last date/time a record was modified.

## Usage
```js
<MetaSection
  contentId="userInfoRecordMetaContent"
  createdDate={user.createdDate}
  headingLevel={4} // Optional
  id="userInfoRecordMeta"
  lastUpdatedDate={user.updatedDate}
/>
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
contentId | string | HTML id attribute assigned to accordion's content |  |
createdBy | string/object | Name/record of the user who created the record. |  |
createdDate | string | Date/time a record was created. |  |
headingLevel | number | Sets the heading level of the heading inside the accordion header. | 4 |
hideSource | boolean | Allows for the concealment of the createdBy and updatedBy information on the display
id | string | HTML id attribute assigned to accordion's root. |  |
inlineLayout | boolean | If it should display inline (`display: flex`) | false |
lastUpdatedBy | string/object | Name/record of the last user who modified the record. |  |
lastUpdatedDate | string | Latest date/time a record was modified. |  |
noBackGround | boolean | If the background color should be disabled | false |
showUserLink | boolean | Should the user name link to the user record? Pass in permission | false |
useAccordion | boolean | If the component should render within an `<Accordion>` | true |
