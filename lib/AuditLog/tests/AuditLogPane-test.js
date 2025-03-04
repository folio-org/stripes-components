import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';

import {
  runAxeTest,
  Card,
  Pane,
  Button,
} from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import Harness from '../../../tests/Harness';

import AuditLogPane from '../AuditLogPane';

const fieldLabelsMap = {
  contributors: 'Contributors',
  statusId: 'Status id',
  statusUpdatedDate: 'Status updated date',
};

const defaultProps = {
  onClose: sinon.spy(),
  fieldLabelsMap,
  isLoading: false,
};

const RenderAuditLogPane = ({
  versions = [],
  ...props
} = {}) => (
  <Harness>
    <AuditLogPane
      {...defaultProps}
      {...props}
      versions={versions}
    />
  </Harness>
);

const mockVersions = [{
  action: 'CREATE',
  diff: {
    fieldChanges: [{
      fieldName: 'fieldName1',
      changeType: 'ADDED',
      newValue: 'newValue1',
      oldValue: 'oldValue1',
    }],
    collectionChanges: [],
  },
  eventDate: '2025-02-21T16:18:49.201+00:00',
}, {
  action: 'UPDATE',
  diff: {
    fieldChanges: [{
      fieldName: 'statusId',
      changeType: 'ADDED',
      newValue: 'newValue2',
      oldValue: 'oldValue2',
    }],
    collectionChanges: [],
  },
  eventDate: '2025-02-21T16:18:49.201+00:00',
}];

describe('AuditLogPane', () => {
  beforeEach(() => {
    defaultProps.onClose.resetHistory();
  });

  describe('should display loading pane if references are loading', () => {
    beforeEach(async () => {
      await mountWithContext(<RenderAuditLogPane isLoading />);
    });

    it('should display loading pane if versions are loading', () => Pane({ title: 'Version history' }).exists());
    it('should display loading button', () => Button('Loading').exists());
    it('should display without a11y errors - loading', () => runAxeTest());
  });


  describe('should display loading pane if references are loading', () => {
    const loadMoreSpy = sinon.spy();
    beforeEach(async () => {
      loadMoreSpy.resetHistory();
      await mountWithContext(
        <RenderAuditLogPane
          versions={mockVersions}
          handleLoadMore={loadMoreSpy}
        />
      );
    });

    it('should display loading pane if versions are loading', () => Pane({ title: 'Version history' }).exists());
    it('should display cards for entries', () => Card().exists());
    it('should display without a11y errors - versions displayed', () => runAxeTest());
    describe('clicking the loadMore button', () => {
      beforeEach(async () => {
        await Button('Load more').click();
      });

      it('calls the handleLoadMore function', () => {
        expect(loadMoreSpy.called).to.equal(true);
      });
    });
  });
});
