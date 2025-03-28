import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';

import {
  runAxeTest,
  Card,
  Pane,
  Button,
  HTML,
  including,
  MultiColumnListCell,
} from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';
import Harness from '../../../tests/Harness';

import AuditLogPane from '../AuditLogPane';

const LoadingInteractor = HTML.extend('loading').selector('[class^=spinner-]')

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
  fieldChanges: [{
    fieldName: 'fieldName3',
    changeType: 'ADDED',
    newValue: 'newValue3',
    oldValue: 'oldValue3',
  }],
  modalFieldChanges: [{
    fieldName: 'fieldName4',
    changeType: 'ADDED',
    newValue: 'newValue4',
    oldValue: 'oldValue4',
  }],
  eventDate: '2025-03-21T16:18:49.201+00:00',
}, {
  fieldChanges: [{
    fieldName: 'fieldName2',
    changeType: 'ADDED',
    newValue: 'newValue2',
    oldValue: 'oldValue2',
  }],
  eventDate: '2025-02-21T16:18:49.201+00:00',
}, {
  isOriginal: true,
  fieldChanges: [{
    fieldName: 'statusId',
    changeType: 'ADDED',
    newValue: 'newValue1',
    oldValue: 'oldValue1',
  }],
}];

describe('AuditLogPane', () => {
  beforeEach(() => {
    defaultProps.onClose.resetHistory();
  });

  describe('should display loading pane if references are loading for the first time', () => {
    beforeEach(async () => {
      await mountWithContext(<RenderAuditLogPane isInitialLoading />);
    });

    it('should display loading pane if versions are loading', () => Pane({ title: 'Version history' }).exists());
    it('should display loading indicator', () => LoadingInteractor().exists());
    it('should display without a11y errors - loading', () => runAxeTest());
  });

  describe('should display loading pane if references are loading', () => {
    const loadMoreSpy = sinon.spy();
    const totalVersions = 123;

    beforeEach(async () => {
      loadMoreSpy.resetHistory();
      await mountWithContext(
        <RenderAuditLogPane
          versions={mockVersions}
          handleLoadMore={loadMoreSpy}
          totalVersions={totalVersions}
        />
      );
    });

    it('should display loading pane if versions are loading', () => Pane({ title: 'Version history' }).exists());
    it('should display cards for entries', () => Card().exists());
    it('should display original version card', () => HTML('Original version').exists());
    it('should display without a11y errors - versions displayed', () => runAxeTest());
    describe('clicking the loadMore button', () => {
      beforeEach(async () => {
        await Button('Load more').click();
      });

      it('calls the handleLoadMore function', () => {
        expect(loadMoreSpy.called).to.equal(true);
      });
    });

    it('should render current version', () => Button('Current version').exists());
    it('should render an ordinary version', () => Button('Changed').exists());
    it('should display the total number of versions', () => HTML(including(totalVersions)).exists());
  });

  describe('when a modal window is open', () => {
    beforeEach(async () => {
      await mountWithContext(
        <RenderAuditLogPane
          versions={mockVersions}
        />
      );
      await Button('Current version').click();
    });

    it('should render field name from modalFieldChanges prop', () => MultiColumnListCell(including('fieldName4')).exists());
  });

  describe('when the showSharedLabel is true', () => {
    beforeEach(async () => {
      await mountWithContext(
        <RenderAuditLogPane
          showSharedLabel
          versions={mockVersions}
        />
      );
    });

    it('should display "Shared" instead of "Original version"', () => HTML('Shared').exists());
    it('should not display "Original version"', () => HTML('Original version').absent());
  });
});
