# MetaSection
Component for displaying record metadata such as the last date/time a record was modified.

## Usage
```js
<MetaSection
  contentId="userInfoRecordMetaContent"
  createdDate={user.createdDate}
  headerElement="h4" // Optional
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
headerElement | string | Sets the HTML element for the header | h4 |
id | string | HTML id attribute assigned to accordion's root. |  |
lastUpdatedBy | string/object | Name/record of the last user who modified the record. |  |
lastUpdatedDate | string | Latest date/time a record was modified. |  |
showUserLink | boolean | Should the user name link to the user record? Pass in permission | false |
