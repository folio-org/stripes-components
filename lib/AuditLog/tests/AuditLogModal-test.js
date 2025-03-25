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
    booleanFieldAdd: 'Boolean field add',
    booleanFieldModify: 'Boolean field modify',
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
  }, {
    changeType: 'ADDED',
    fieldName: 'booleanFieldAdd',
    oldValue: false,
    newValue: true,
  }, {
    changeType: 'MODIFIED',
    fieldName: 'booleanFieldModify',
    oldValue: true,
    newValue: false,
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

  it('should render a boolean value when add', async () => {
    await mcl.find(MultiColumnListCell({ row: 2, columnIndex: 0 })).perform(el => {
      expect(el.textContent).to.equal('ADDED');
    });
    await mcl.find(MultiColumnListCell({ row: 2, columnIndex: 1 })).perform(el => {
      expect(el.textContent).to.equal('Boolean field add');
    });
    await mcl.find(MultiColumnListCell({ row: 2, columnIndex: 2 })).perform(el => {
      expect(el.textContent).to.equal('No value set-');
    });
    await mcl.find(MultiColumnListCell({ row: 2, columnIndex: 3 })).perform(el => {
      expect(el.textContent).to.equal('true');
    });
  });

  it('should render a boolean value when modify', async () => {
    await mcl.find(MultiColumnListCell({ row: 3, columnIndex: 0 })).perform(el => {
      expect(el.textContent).to.equal('MODIFIED');
    });
    await mcl.find(MultiColumnListCell({ row: 3, columnIndex: 1 })).perform(el => {
      expect(el.textContent).to.equal('Boolean field modify');
    });
    await mcl.find(MultiColumnListCell({ row: 3, columnIndex: 2 })).perform(el => {
      expect(el.textContent).to.equal('true');
    });
    await mcl.find(MultiColumnListCell({ row: 3, columnIndex: 3 })).perform(el => {
      expect(el.textContent).to.equal('false');
    });
  });

  describe('when clicking the close button', () => {
    beforeEach(async () => {
      await auditLogModal.clickClose();
    });

    it('the onClose callback should be fired', () => converge(() => onClose.called));
  });
});
