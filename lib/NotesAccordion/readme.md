# NotesAccordion

Accordion enhanced to work with Notes

## Basic Usage

```js
  <NotesAccordion
    open
    notes={[
      {
        id: 'uuid-1',
        title: 'Conversation with Kim White',
        lastSavedDate: '11/12/19',
        lastSavedUserFullName: 'Ann Brown',
      },
      {
        id: 'uuid-2',
        title: 'Conversation with Jean Smith',
        lastSavedDate: '07/12/19',
        lastSavedUserFullName: 'Alice Jones',
      }
    ]}
    onCreate={() => {})}
    onNoteClick={(noteId) => {}}
  />
```

## Properties

Name | type | description | default | required
--- | --- | --- | --- | ---
`notes` | array of object | the list of notes to be displayed in table view. | | required
`onCreate` | function | callback to be called after click on "New" button | | required
`onNoteClick` | function | callback to be called after click on note item | | required
`open` | bool | indicates  whether accordion is expanded/collapsed |  |
