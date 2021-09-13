/**
 * MenuSection tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { StaticRouter } from 'react-router'; /* eslint-disable-line import/no-extraneous-dependencies */

import { mountWithContext } from '../../../tests/helpers';

import MetaSection from '../MetaSection';
import MetaSectionInteractor from './interactor';

describe('MetaSection', () => {
  const metaSection = new MetaSectionInteractor();

  describe('Renders ids', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MetaSection
          id="accordionId"
          contentId="contentId"
        />
      );
    });

    it('Includes id', () => {
      expect(metaSection.accordion.$root.id).to.equal('accordionId');
    });
    it('Includes content id', () => {
      expect(metaSection.accordion.id).to.equal('contentId');
    });
  });

  describe('Renders strings', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MetaSection
          createdBy="Bill the Cat"
          lastUpdatedBy="Opus"
        />
      );
      await metaSection.header.click();
    });

    it('Should render updated-by field', () => {
      expect(metaSection.updatedByText).to.contain('Opus');
    });
    it('Should render created-by field', () => {
      expect(metaSection.createdByText).to.contain('Bill the Cat');
    });
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
      await metaSection.header.click();
    });

    it('Should render "last, first middle"', () => {
      expect(metaSection.updatedByText).to.contain('Cat, Bill the');
    });
    it('Should render "last"', () => {
      expect(metaSection.createdByText).to.contain('Opus');
    });
    it('Should render "last" without a comma', () => {
      expect(metaSection.createdByText).to.not.contain(',');
    });
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
      await metaSection.header.click();
    });

    it('Should render link given id', () => {
      expect(metaSection.createdByLinkIsPresent).to.be.true;
    });
    it('Should not render link without id', () => {
      expect(metaSection.updatedByLinkIsPresent).to.be.false;
    });
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
      await metaSection.header.click();
    });

    it('Should only render created-by link given showUserLink', () => {
      expect(metaSection.createdByLinkIsPresent).to.be.false;
    });
    it('Should only render updated-by link given showUserLink', () => {
      expect(metaSection.updatedByLinkIsPresent).to.be.false;
    });
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
      await metaSection.header.click();
    });

    it('Should only render created-by link given showUserLink and an object', () => {
      expect(metaSection.createdByLinkIsPresent).to.be.false;
    });
    it('Should only render updated-by link given showUserLink and an object', () => {
      expect(metaSection.updatedByLinkIsPresent).to.be.false;
    });
  });

  describe('If no create or update details are provided', () => {
    beforeEach(async () => {
      await mountWithContext(
        <MetaSection />
      );
      await metaSection.header.click();
    });

    it('Should render "unknown" updated field', () => {
      expect(metaSection.updatedText).to.contain('Unknown');
    });
    it('Should render "automated process" updated-by field', () => {
      expect(metaSection.updatedByText).to.contain('Automated process');
    });
    it('Should render "unknown" created field', () => {
      expect(metaSection.createdText).to.contain('Unknown');
    });
    it('Should render "automated process" created-by field', () => {
      expect(metaSection.createdByText).to.contain('Automated process');
    });
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
      await metaSection.header.click();
    });

    it('Should render createdDate field', () => {
      expect(metaSection.createdTextIsPresent).to.be.true;
    });

    it('Should not render createdBy field', () => {
      expect(metaSection.createdByTextIsPresent).to.be.false;
    });

    it('Should render lastUpdatedDate field', () => {
      expect(metaSection.updatedTextIsPresent).to.be.true;
    });

    it('Should not render updatedBy field', () => {
      expect(metaSection.updatedByTextIsPresent).to.be.false;
    });
  });
});
