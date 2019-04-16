import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import withReadme from 'storybook-readme/with-readme';

import readme from '../readme.md';
import { NotesAccordion } from '../NotesAccordion';

storiesOf('NotesAccordion', module)
  .addDecorator(withReadme(readme))
  .add('Basic Usage', () => (
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
      onCreate={action('note id')}
      onNoteClick={action('note id')}
    />
  ))
  .add('With empty notes list', () => (
    <NotesAccordion
      open
      notes={[]}
      onCreate={action('note id')}
      onNoteClick={action('note id')}
    />
  ));
