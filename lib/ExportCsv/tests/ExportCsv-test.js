import React from 'react';
import { beforeEach, it, describe } from 'mocha';
import { Button, Bigtest } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';

import ExportCsv from '../ExportCsv';
import testData from './export';

const { Link } = Bigtest;

describe('ExportCSV', () => {
  const exportButton = Button();

  beforeEach(async () => {
    await mountWithContext(
      <ExportCsv
        data={testData}
        onlyFields={['name']}
      />
    );
  });

  it('renders the exportCSV button', () => Button('Export to CSV').exists());

  describe('Clicking the button', () => {
    beforeEach(async () => {
      await exportButton.click();
    });

    it('creates a link node', () => Link({ visible: false }).exists());
  });
});
