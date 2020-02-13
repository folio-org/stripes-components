import React from 'react';
import { beforeEach, it, describe } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';
import ButtonInteractor from '../../Button/tests/interactor';

import ExportCsv from '../ExportCsv';
import testData from './export';

describe('ExportCSV', () => {
  const exportButton = new ButtonInteractor(['data-test-export-csv']);
  const exportLink = new ButtonInteractor('a[data-test-exportcsv-link]');

  beforeEach(async () => {
    await mountWithContext(
      <ExportCsv
        data={testData}
        onlyFields={['name']}
      />
    );
  });

  it('renders the exportCSV button', () => {
    expect(exportButton.isPresent).to.be.true;
    expect(exportButton.isButton).to.be.true;
    expect(exportButton.rendersDefault).to.be.true;
  });

  it('renders the exportCSV button label', () => {
    expect(exportButton.text).to.equal('Export to CSV');
  });

  describe('Clicking the button', () => {
    beforeEach(async () => {
      await exportButton.click();
    });

    it('creates a link node', () => {
      expect(exportLink.isPresent).to.be.true;
      expect(exportLink.isAnchor).to.be.true;
      expect(exportLink.label).to.equal('');
    });
  });
});
