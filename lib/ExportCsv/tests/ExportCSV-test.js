/**
 * Icon tests
 */

import React from 'react';

import { beforeEach, it, describe } from '@bigtest/mocha';
import { expect } from 'chai';
import { mountWithContext } from '../../../tests/helpers';
import ExportCsvInteractor from './interactor';

import ExportCsv from '../ExportCsv';
import testData from './export';

const exportButton = new ExportCsvInteractor();

describe('ExportCSV', () => {
  describe('Rendering ExportCSV', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ExportCsv
          data={testData}
          onlyFields={['name']}
        />
      );
    });

    it('Renders the exportCSV button', () => {
      expect(exportButton.isDisplayed).to.be.true;
    });

    // commenting until we can figure out a way to suppress the download in test browsers.
    // describe('Clicking the button', () => {
    //   beforeEach(async () => {
    //     await exportButton.click();
    //   });

    //   it('creates a link node', () => {
    //     expect(exportButton.linkMade).to.be.true;
    //   });
    // });
  });
});
