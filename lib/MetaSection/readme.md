# MetaSection
Simple component for displaying record metadata such as the last date/time a record was modified.

## Usage
```
<MetaSection
  id="userInfoRecordMeta"
  contentId="userInfoRecordMetaContent"
  lastUpdatedDate={user.updatedDate}
  createdDate={user.createdDate}
/>
```

## Props
Name | type | description | default | required
--- | --- | --- | --- | ---
lastUpdatedDate | string | Latest date/time a record was modified. |  |
lastUpdatedBy | string/object | Name/record of the last user who modified the record. |  |
createdDate: | string | Date/time a record was created. |  |
createdBy: | string/object | Name/record of the user who created the record. |  |
id: | string | HTML id attribute assigned to accordion's root. |  |
contentId: | string | HTML id attribute assigned to accordion's content |  |
