import React from 'react';
import { describe, beforeEach, afterEach, it } from 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';

import {
  runAxeTest,
  List,
  ListItem,
  Button,
  including,
} from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import Harness from '../../../tests/Harness';

import AuditLogChangedFieldsList from '../AuditLogChangedFieldsList';

describe('AuditLogChangedFieldsList', () => {
  const fieldChanges = [{
    changeType: 'MODIFIED',
    fieldName: 'name1',
  }];

  const fieldLabelsMap = {
    name1: 'Name 1',
  };

  const onChangeSpy = sinon.spy();

  describe('rendering a button', () => {
    beforeEach(async () => {
      await mount(
        <Harness>
          <AuditLogChangedFieldsList
            actionsMap={{}}
            fieldLabelsMap={fieldLabelsMap}
            fieldChanges={fieldChanges}
            onChangeButtonClick={onChangeSpy}
          />
        </Harness>
      );
    });

    afterEach(() => {
      onChangeSpy.resetHistory();
    });

    it('has no axe errors', runAxeTest);

    it('should render field changes', () => List().find(ListItem(including('Name 1 (MODIFIED)'))).exists());

    describe('when clicking on changes button', () => {
      beforeEach(async () => {
        await Button().click();
      });

      it('should call the callback', () => {
        expect(onChangeSpy.called).to.be.true;
      });
    });
  });
});
