# ExportCsv
Component for exporting the data into a csv file.

## Props
Name | Type | Description 
-- | -- | -- 
`data` | array of object | List of objects to be displayed in the csv 
`onlyFields` | array of object or array of string | Keys to be displayed for the column headers in the CSV file 

The `onlyFields` prop can be either an array of strings thats represent the column headers for the csv file:
eg: `onlyFields={['id', 'name', 'title']}`

or it could be a map between the UI labels and the backend shape for the corresponding data:
eg: in the translations file: `metaData.createdDate`: `createDate`

```js
  const item = metaData.createdDate
  const onlyFields = [
    {
        label: intl.formatMessage({ id: `ui-users.${item}` }),
        value: item
    },
];
```
This would display the column header to be `createDate` whereas the value from the data would be fetched from
`metaData.createdDate`. This technique should be used for the scenarios where we need the column headers in the csv
to match the labels on the UI.
