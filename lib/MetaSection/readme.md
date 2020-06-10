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
id | string | HTML id attribute assigned to accordion's root. |  |
lastUpdatedBy | string/object | Name/record of the last user who modified the record. |  |
lastUpdatedDate | string | Latest date/time a record was modified. |  |
showUserLink | boolean | Should the user name link to the user record? Pass in permission | false |
