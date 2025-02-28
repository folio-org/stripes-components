# AuditLog
A pane with version history cards. 

## Basic Usage
```js
import { AuditLogPane, NoValue } from '@folio/stripes/components';

<AuditLogPane
  versions={[{
    eventDate,
    source: 'lastName, firstName',
    userName: 'lastName, firstName',
    fieldChanges: [{
      fieldName: 'name',
      changeType: 'ADDED',
      newValue: 'newValue',
      oldValue: 'oldValue',
    }],
    eventId,
    eventTs,
  }]}
  onClose={onClose}
  isLoadedMoreVisible={true}
  handleLoadMore={handleLoadMore}
  isLoading={isLoading}
  fieldLabelsMap={{
    administrativeNotes: formatMessage({ id: 'ui-inventory.administrativeNotes' }),
    alternativeTitles: formatMessage({ id: 'ui-inventory.alternativeTitles' }),
  }}
  fieldFormatter={{
    contributorTypeText: value => value || <NoValue />,
    primary: value => value.toString(),
  }}
  actionsMap={{}}
/>
```

## Props
Name | type | description | default | required
-- |--------| --
actionsMap | object | Maps change type value to user friendly action label | | false
columnWidths | object | Sets custom column widths to modal window columns | | false
fieldFormatter | object | Formats changed field value in modal content, used to format field oldValue/newValue | | false
fieldLabelsMap | object | Maps changed field name to user friendly label | | false
handleLoadMore | func | Callback fired when the "Load more" button is clicked | | false
isLoadedMoreVisible | bool | Flag that indicates whether "Load more" button visible or not | true | false
isLoading | bool | Flag that indicates whether versions are loaded or not | | false
onClose | func | Callback fired when the pane is closed using its dismiss button. | | false
versions | array | List of changed fields and its values | | true
