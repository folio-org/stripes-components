# AuditLogPane
AuditLogPane is a component that renders the Version history pane to view and track updates to different record types.
It displays a list of AuditLogCard components, each representing a specific change event.
Each AuditLogCard has a "Changed" button, clicking on the button within an AuditLogCard opens an AuditLogModal to display
detailed fields changes information.

## Basic Usage
```js
import { AuditLogPane, NoValue } from '@folio/stripes/components';

const versions = [{
  eventDate: '2025-03-01',
  source: 'Doe, John',
  userName: 'Doe, John',
  fieldChanges: [{
    fieldName: 'name',
    changeType: 'ADDED',
    newValue: 'newValue',
    oldValue: 'oldValue',
  }],
  eventId: '12345',
  eventTs: 1700000000,
}];

const fieldLabelsMap = {
  administrativeNotes: formatMessage({ id: 'ui-inventory.administrativeNotes' }),
  alternativeTitles: formatMessage({ id: 'ui-inventory.alternativeTitles' }),
};

const fieldFormatter = {
  contributorTypeText: value => value || <NoValue />,
  primary: value => value.toString(),
};

const handleClose = () => console.log('Pane closed');
const handleLoadMore = () => console.log('Load more clicked');
const isLoading = false;
const isInitialLoading = false;
const isLoadMoreVisible = true;
const showSharedLabel = false;
const actionsMap = { ADDED: formatMessage({ id: 'ui-inventory.versionHistory.action.added' }) };

return (
  <AuditLogPane
    versions={versions}
    onClose={handleClose}
    isLoadMoreVisible={isLoadMoreVisible}
    handleLoadMore={handleLoadMore}
    isLoading={isLoading}
    isInitialLoading={isInitialLoading}
    showSharedLabel={showSharedLabel}
    fieldLabelsMap={fieldLabelsMap}
    fieldFormatter={fieldFormatter}
    actionsMap={actionsMap}
    totalVersions={totalRecords}
  />
);
```

## Props
Name | type   | description                                                                           | default | required
--- |--------|---------------------------------------------------------------------------------------|---------| ---
actionsMap | object | Maps change type value to user friendly action label                                  |         | false
columnWidths | object | Sets custom column widths to modal window columns                                     |         | false
fieldFormatter | object | Formats changed field value in modal content, used to format oldValue/newValue fields |         | false
fieldLabelsMap | object | Maps changed field name to user friendly label                                        |         | false
handleLoadMore | func   | Callback fired when the "Load more" button is clicked                                 |         | false
isInitialLoading | bool   | Flag that indicates whether data is being loaded for the first time                   |         | false
isLoading | bool   | Flag that indicates whether data is being loaded                                      |         | false
isLoadMoreVisible | bool   | Flag that indicates whether "Load more" button visible or not                         | true    | false
onClose | func   | Callback fired when the pane is closed using its dismiss button                       |         | false
showSharedLabel | bool   | Flag indicating whether the original version should display "Shared" label       | false   | false
totalVersions | number | Total number of versions                                                              |         | false
versions | array  | An array of objects containing version change details                                 |         | true

## AuditLogCard
AuditLogCard represents a single change event within AuditLogPane.

### Basic usage
```js
import { AuditLogCard } from '@folio/stripes/components';

const versionCards = () => {
  return versions.map(({
    isOriginal,
    eventId,
    eventDate,
    source,
    userName,
    fieldChanges,
    modalFieldChanges,
  }, i) => {
    return (
      <AuditLogCard
        key={eventId || i}
        isCurrentVersion={i === 0}
        isOriginal={isOriginal}
        showSharedLabel={showSharedLabel}
        date={eventDate}
        source={source}
        userName={userName}
        fieldChanges={fieldChanges}
        fieldLabelsMap={fieldLabelsMap}
        fieldFormatter={fieldFormatter}
        actionsMap={actionsMap}
        columnWidths={columnWidths}
        modalFieldChanges={modalFieldChanges}
      />
    );
  });
};
```

### Props
Name | type           | description                                                                                  | default | required
--- |----------------|----------------------------------------------------------------------------------------------| --- | ---
actionsMap | object         | Maps change type value to user friendly action label                                         | | false
columnWidths | object         | Sets custom column widths to modal window columns                                            | | false
date | string         | The date of the change event                                                                 | | true
fieldChanges | array          | A list of changed fields                                                                     | | true
fieldFormatter | object         | Formats changed field value in modal content, used to format oldValue/newValue fields        | | false
fieldLabelsMap | object         | Maps changed field name to user friendly label                                               | | false
isCurrentVersion | bool           | The flag that indicates that a card represents the current version                           | | false
isOriginal | bool           | The flag that indicates that a card represents the original version and has no field changes | | false
 |            |   | | 
modalFieldChanges | array          | A list of changed fields for card modal window                                               | | false
source | string or node | The source of fields changes                                                                 | | true
showSharedLabel | bool | Flag indicating whether the original version should display "Shared" label                      | | false
userName | string         | The name of the user who made the change                                                     | | true

## AuditLogChangedFieldsList
AuditLogChangedFieldsList renders a list of changed fields and "Changed" button within an AuditLogCard.

### Basic usage
```js
import { AuditLogChangedFieldsList } from '@folio/stripes/components';

const actionsMap = { ADDED: formatMessage({ id: 'ui-inventory.versionHistory.action.added' }) };
const fieldChanges = [{
  fieldName: 'name',
  changeType: 'ADDED',
  newValue: 'newValue',
  oldValue: 'oldValue',
}];
const fieldLabelsMap = {
  administrativeNotes: formatMessage({ id: 'ui-inventory.administrativeNotes' }),
  alternativeTitles: formatMessage({ id: 'ui-inventory.alternativeTitles' }),
};
const onChangeButtonClick = () => console.log('Changed clicked');

return (
  <AuditLogChangedFieldsList
    actionsMap={actionsMap}
    fieldChanges={fieldChanges}
    fieldLabelsMap={fieldLabelsMap}
    isCurrentVersion={isCurrentVersion}
    onChangeButtonClick={onChangeButtonClick}
  />
);
```

### Props
Name | type   | description                                                                         | default | required
--- |--------|-------------------------------------------------------------------------------------| --- | ---
actionsMap | object | Maps change type value to user friendly action label                                | | false
fieldChanges | array  | A list of changed fields                                                            | | false
fieldLabelsMap | object | Maps changed field name to user friendly label                                      | | false
isCurrentVersion | bool   | The flag that indicates that a card represents the current version  | | false
onChangeButtonClick | func   | Callback triggered when clicking the "Changed" button                             | | false

## AuditLogModal
AuditLogModal is a modal window that opens when the "Changed" button is clicked, displaying detailed fields changes information.

### Basic usage
```js
import { AuditLogModal, NoValue } from '@folio/stripes/components';

const [isModalOpen, setIsModalOpen] = useState(true);

const actionsMap = { ADDED: formatMessage({ id: 'ui-inventory.versionHistory.action.added' }) };
const fieldChanges = [{
  fieldName: 'name',
  changeType: 'ADDED',
  newValue: 'newValue',
  oldValue: 'oldValue',
}];
const fieldLabelsMap = {
  administrativeNotes: formatMessage({ id: 'ui-inventory.administrativeNotes' }),
  alternativeTitles: formatMessage({ id: 'ui-inventory.alternativeTitles' }),
};
const fieldFormatter = {
  contributorTypeText: value => value || <NoValue />,
  primary: value => value.toString(),
};
const modalHeader = (
  <>
    {date}
    <br />
    <FormattedMessage
      id="stripes-components.metaSection.source"
      values={{ source: userName }}
    />
  </>
);
const columnWidths = { action: '30px' };

return (
  <AuditLogModal
    contentData={fieldChanges}
    open={isModalOpen}
    label={modalHeader}
    onClose={() => setIsModalOpen(false)}
    fieldLabelsMap={fieldLabelsMap}
    fieldFormatter={fieldFormatter}
    isCurrentVersion={isCurrentVersion}
    actionsMap={actionsMap}
    columnWidths={columnWidths}
  />
);
```

### Props
Name | type           | description                                                                         | default | required
--- |----------------|-------------------------------------------------------------------------------------| --- | ---
actionsMap | object         | Maps change type value to user friendly action label                                | | false
columnWidths | object         | Sets custom column widths to modal window columns                                   | | false
contentData | array          | A list of changed fields                                                            | | true
fieldLabelsMap | object         | Maps changed field name to user friendly label                                      | | false
fieldFormatter | object         | Formats changed field value in modal content, used to format oldValue/newValue fields | | false
label | string or node | The header label of the modal                                                       | | true
isCurrentVersion | bool   | The flag that indicates that a card represents the current version  | | false
onClose | func           | Callback triggered when closing the modal                                | | false
open | bool           | Indicates whether the modal is open | | true

## useVersionHistory hook
React hook for managing version history data and the "Load more" button visibility.
Can be used together with `<AuditLogPane>` components.

### Basic usage
```js
import { useVersionHistory } from '@folio/stripes/components';

const { data, totalRecords } = useInstanceAuditDataQuery();


export const versionsFormatter = diffArray => {
  return diffArray
    .filter(({ action }) => action !== 'CREATE')
    .map(({ eventDate, eventTs, userId, eventId, diff }) => ({
      eventDate: formatDateTime(eventDate),
      source: getSourceLink(userId),
      userName: getUserName(userId) || anonymousUserLabel,
      fieldChanges: diff.fieldChanges || [],
      eventId,
      eventTs,
    }));
};

const {
  versions,
  isLoadMoreVisible,
} = useVersionHistory({
  data,
  totalRecords,
  versionsFormatter,
});
```
