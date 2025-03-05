import React from 'react';
import sinon from 'sinon';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import {
  runAxeTest,
  Modal,
  Button,
  MultiColumnList,
  MultiColumnListCell,
  including,
  converge,
} from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import Harness from '../../../tests/Harness';
import AuditLogModal from '../AuditLogModal';

const AuditLogModalInteractor = Modal.extend('AuditLog modal')
  .actions({
    clickClose: ({ find }, label = 'Close') => find(Button(including(label))).click()
  });

describe('AuditLogModal', () => {
  const auditLogModal = AuditLogModalInteractor();
  const mcl = MultiColumnList();
  const onClose = sinon.spy();

  const buttonLabel = 'Close';
  const fieldLabelsMap = {
    name1: 'Name 1',
    repeatable: 'Repeatable name',
  };
  const fieldFormatter = {
    repeatable: (value) => `Repeatable: ${value}`,
  };
  const contentData = [{
    changeType: 'ADDED',
    fieldName: 'name1',
    newValue: 'added a field',
  }, {
    changeType: 'MODIFIED',
    fieldName: 'repeatable',
    newValue: {
      repeatable: 'new repeatable value',
    },
    oldValue: {
      repeatable: 'old repeatable value',
    },
  }];
  const actionsMap = {
    ADDED: 'ADDED',
    MODIFIED: 'MODIFIED',
  };

  beforeEach(async () => {
    await mountWithContext(
      <Harness>
        <AuditLogModal
          open
          label="Audit log modal label"
          onClose={onClose}
          contentData={contentData}
          fieldLabelsMap={fieldLabelsMap}
          fieldFormatter={fieldFormatter}
          actionsMap={actionsMap}
        />
      </Harness>
    );
  });

  it('has no axe errors. - AuditLogModal', runAxeTest);

  it('shows correct close button label', () => Button(buttonLabel).exists());

  it('should render a string value as a string', async () => {
    await mcl.find(MultiColumnListCell({ row: 0, columnIndex: 0 })).perform(el => {
      expect(el.textContent).to.equal('ADDED');
    });
    await mcl.find(MultiColumnListCell({ row: 0, columnIndex: 1 })).perform(el => {
      expect(el.textContent).to.equal('Name 1');
    });
    await mcl.find(MultiColumnListCell({ row: 0, columnIndex: 2 })).perform(el => {
      expect(el.textContent).to.equal('No value set-');
    });
    await mcl.find(MultiColumnListCell({ row: 0, columnIndex: 3 })).perform(el => {
      expect(el.textContent).to.equal('added a field');
    });
  });

  it('should render an object value with mapped field names', async () => {
    await mcl.find(MultiColumnListCell({ row: 1, columnIndex: 0 })).perform(el => {
      expect(el.textContent).to.equal('MODIFIED');
    });
    await mcl.find(MultiColumnListCell({ row: 1, columnIndex: 1 })).perform(el => {
      expect(el.textContent).to.equal('Repeatable name');
    });
    await mcl.find(MultiColumnListCell({ row: 1, columnIndex: 2 })).perform(el => {
      expect(el.textContent).to.equal('Repeatable: old repeatable value');
    });
    await mcl.find(MultiColumnListCell({ row: 1, columnIndex: 3 })).perform(el => {
      expect(el.textContent).to.equal('Repeatable: new repeatable value');
    });
  });

  describe('when clicking the close button', () => {
    beforeEach(async () => {
      await auditLogModal.clickClose();
    });

    it('the onClose callback should be fired', () => converge(() => onClose.called));
  });
});
