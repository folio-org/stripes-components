import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedDate,
} from 'react-intl';

import MultiColumnList from '../../../MultiColumnList';
import { noteShape } from '../../NotesAccordion';


const COLUMN_NAMES = ['date', 'updatedBy', 'title'];
const COLUMN_WIDTHS = {
  date: '30%',
  updatedBy: '30%',
  title: '40%',
};

const columnsMap = {
  date: <FormattedMessage id="stripes-components.date" />,
  updatedBy: <FormattedMessage id="stripes-components.updatedBy" />,
  title: <FormattedMessage id="stripes-components.title" />,
};

export default class NotesList extends React.Component {
  static propTypes = {
    notes: PropTypes.arrayOf(noteShape).isRequired,
    onNoteClick: PropTypes.func.isRequired,
  }

  getItems() {
    return this.props.notes
      .map(note => {
        const {
          id,
          title,
          lastSavedDate,
          lastSavedUserFullName,
        } = note;

        return {
          id,
          date: (
            <FormattedDate
              value={lastSavedDate}
              year="numeric"
              month="numeric"
              day="numeric"
            />
          ),
          updatedBy: lastSavedUserFullName,
          title,
        };
      });
  }

  onRowClickHandler = (event, note) => {
    this.props.onNoteClick(note.id);
  }

  render() {
    return (
      <FormattedMessage id="stripes-components.notes">
        {
          (ariaLabel) => (
            <MultiColumnList
              id="notes-list"
              data-test-notes-accordion-list
              interactive
              ariaLabel={ariaLabel}
              contentData={this.getItems()}
              visibleColumns={COLUMN_NAMES}
              columnMapping={columnsMap}
              columnWidths={COLUMN_WIDTHS}
              isEmptyMessage={<FormattedMessage id="stripes-components.notes.notFound" />}
              onRowClick={this.onRowClickHandler}
            />
          )
        }
      </FormattedMessage>
    );
  }
}
