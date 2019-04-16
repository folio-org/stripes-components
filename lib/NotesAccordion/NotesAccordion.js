import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  get,
} from 'lodash';

import { Accordion } from '../Accordion';
import Headline from '../Headline';
import Badge from '../Badge';
import Button from '../Button';

import NotesList from './components';
import styles from './NotesAccordion.css';

export const noteShape = PropTypes.shape({
  id: PropTypes.string,
  lastSavedDate: PropTypes.instanceOf(Date),
  lastSavedUserFullName: PropTypes.string,
  title: PropTypes.string,
});

export class NotesAccordion extends Component {
  static propTypes = {
    notes: PropTypes.arrayOf(noteShape),
    onCreate: PropTypes.func.isRequired,
    onNoteClick: PropTypes.func.isRequired,
    open: PropTypes.bool,
  }

  renderHeader = () => {
    return (
      <Headline
        data-test-notes-accordion-header
        size="large"
        tag="h3"
      >
        <FormattedMessage id="stripes-components.notes" />
      </Headline>
    );
  }

  renderHeaderButtons() {
    const {
      onCreate,
    } = this.props;

    return (
      <Fragment>
        <Button
          data-test-notes-accordion-add-button
        >
          <FormattedMessage id="stripes-components.add" />
        </Button>
        <Button
          data-test-notes-accordion-new-button
          buttonClass={styles['new-button']}
          onClick={onCreate}
        >
          <FormattedMessage id="stripes-components.button.new" />
        </Button>
      </Fragment>
    );
  }

  getNotesQuantity() {
    return get(this.props.notes, 'length');
  }

  renderQuantityIndicator() {
    return (
      <Badge>
        <span data-test-notes-accordion-quantity-indicator>
          {this.getNotesQuantity()}
        </span>
      </Badge>
    );
  }

  renderEmptyMessage() {
    return (
      <span data-test-notes-accordion-empty-message>
        <FormattedMessage id="stripes-components.notes.notFound" />
      </span>
    );
  }

  render() {
    const {
      open,
      notes,
      onNoteClick,
    } = this.props;

    return (
      <Accordion
        id="notes-accordion"
        open={open}
        label={this.renderHeader()}
        displayWhenClosed={this.renderQuantityIndicator()}
        displayWhenOpen={this.renderHeaderButtons()}
      >
        <NotesList
          notes={notes}
          onNoteClick={onNoteClick}
        />
      </Accordion>
    );
  }
}
