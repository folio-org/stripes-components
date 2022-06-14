/**
 * MenuSection tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { StaticRouter } from 'react-router'; /* eslint-disable-line import/no-extraneous-dependencies */
import { including, not, MetaSection as MetaSectionInteractor } from '@folio/stripes-testing';

import { mountWithContext } from '../../../tests/helpers';

import MetaSection from '../MetaSection';

describe('MetaSection', () => {
  const metaSection = MetaSectionInteractor();

  describe('Renders ids', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MetaSection
          id="accordionId"
          contentId="contentId"
        />
      );
    });

    it('Includes id',
      () => metaSection.has({ id: 'accordionId' }));

    it('Includes content id',
      () => metaSection.has({ contentId: 'contentId' }));
  });

  describe('Renders strings', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MetaSection
          createdBy="Bill the Cat"
          lastUpdatedBy="Opus"
        />
      );
      await metaSection.click();
    });

    it('Should render updated-by field',
      () => metaSection.has({ updatedByText: including('Opus') }));

    it('Should render created-by field',
      () => metaSection.has({ createdByText: including('Bill the Cat') }));
  });

  describe('Renders objects', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MetaSection
          createdBy={{
            personal: {
              lastName: 'Opus',
            }
          }}
          lastUpdatedBy={{
            personal: {
              firstName: 'Bill',
              lastName: 'Cat',
              middleName: 'the',
            }
          }}
        />
      );
      await metaSection.clickHeader();
    });

    it('Should render "last, first middle"',
      () => metaSection.has({ updatedByText: including('Cat, Bill the') }));

    it('Should render "last"',
      () => metaSection.has({ createdByText: including('Opus') }));

    it('Should render "last" without a comma',
      () => metaSection.has({ createdByText: not(including(',')) }));
  });

  describe('Renders links given showUserLink and an object', () => {
    beforeEach(async () => {
      await mountWithContext(
        <StaticRouter context={{}}>
          <MetaSection
            showUserLink
            createdBy={{
              id: '1234',
              personal: {
                firstName: 'Cutter',
                lastName: 'John',
              }
            }}
            lastUpdatedBy={{
              personal: {
                firstName: 'Oliver',
                lastName: 'Jones',
                middleName: 'Wendell',
              }
            }}
          />
        </StaticRouter>
      );
      await metaSection.clickHeader();
    });

    it('Should render link given id',
      () => metaSection.has({ createdByLink: including('John, Cutter') }));

    it('Should not render link without id',
      () => metaSection.has({ updatedByLink: undefined }));
  });

  describe('Does not render links without showUserLink', () => {
    beforeEach(async () => {
      await mountWithContext(
        <StaticRouter context={{}}>
          <MetaSection
            createdBy={{
              id: '1234',
              personal: {
                firstName: 'Cutter',
                lastName: 'John',
              }
            }}
            lastUpdatedBy={{
              id: '1234',
              personal: {
                firstName: 'Oliver',
                lastName: 'Jones',
                middleName: 'Wendell',
              }
            }}
          />
        </StaticRouter>
      );
      await metaSection.clickHeader();
    });

    it('Should only render created-by link given showUserLink',
      () => metaSection.has({ createdByLink: undefined }));

    it('Should only render updated-by link given showUserLink',
      () => metaSection.has({ updatedByLink: undefined }));
  });

  describe('Does not render links without objects', () => {
    beforeEach(async () => {
      await mountWithContext(
        <StaticRouter context={{}}>
          <MetaSection
            showUserLink
            createdBy="Cutter John"
            lastUpdatedBy="Oliver Wendell Jones"
          />
        </StaticRouter>
      );
      await metaSection.clickHeader();
    });

    it('Should only render created-by link given showUserLink and an object',
      () => metaSection.has({ createdByLink: undefined }));

    it('Should only render updated-by link given showUserLink and an object',
      () => metaSection.has({ updatedByLink: undefined }));
  });

  describe('If no create or update details are provided', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MetaSection />
      );
      await metaSection.clickHeader();
    });

    it('Should render "unknown" updated field',
      () => metaSection.has({ updatedText: including('Unknown') }));

    it('Should render "Unknown user" updated-by field',
      () => metaSection.has({ updatedByText: including('Unknown user') }));

    it('Should render "unknown" created field',
      () => metaSection.has({ createdText: including('Unknown') }));

    it('Should render "Unknown user" created-by field',
      () => metaSection.has({ createdByText: including('Unknown user') }));
  });

  describe('If hideSource provided', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MetaSection
          createdDate="2010-07-08T00:00:00Z"
          hideSource
          lastUpdatedDate="2021-07-08T00:00:00Z"
        />
      );
      await metaSection.clickHeader();
    });

    it('Should render createdDate field',
      () => metaSection.has({ createdText: not(undefined) }));

    it('Should not render createdBy field',
      () => metaSection.has({ createdByText: undefined }));

    it('Should render lastUpdatedDate field',
      () => metaSection.has({ updatedText: not(undefined) }));

    it('Should not render updatedBy field',
      () => metaSection.has({ updatedByText: undefined }));
  });
});
