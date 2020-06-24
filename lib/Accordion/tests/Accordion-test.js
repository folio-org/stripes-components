import React from 'react';
import { IntlProvider } from 'react-intl';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../../../tests/helpers';

import Accordion from '../Accordion';
import AccordionSet from '../AccordionSet';
import { AccordionInteractor, AccordionSetInteractor } from './interactor';

describe('Accordion', () => {
  const accordion = new AccordionInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Accordion label="test">
        <div style={{ height: 100 }}>
          Test Content.
        </div>
      </Accordion>
    );
  });

  it('is open by default', () => {
    expect(accordion.isOpen).to.be.true;
    expect(accordion.contentHeight).to.equal(100);
  });

  it('has a label', () => {
    expect(accordion.label).to.equal('test');
  });

  describe('is closed', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Accordion label="test" open={false}>
          <div style={{ height: 100 }}>
            Test Content.
          </div>
        </Accordion>
      );
    });

    it('content height equal to 0', () => {
      expect(accordion.contentHeight).to.equal(0);
    });
  });

  describe('clicking the header', () => {
    beforeEach(async () => {
      await accordion.clickHeader();
    });

    it('closes the accordion', () => {
      expect(accordion.isOpen).to.be.false;
      expect(accordion.contentHeight).to.equal(0);
    });

    describe('clicking the header again', () => {
      beforeEach(async () => {
        await accordion.clickHeader();
      });

      it('opens the accordion', () => {
        expect(accordion.isOpen).to.be.true;
        expect(accordion.contentHeight).to.equal(100);
      });
    });
  });

  describe('when the accordion is closed by default', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Accordion label="test" closedByDefault>
          <div style={{ height: 100 }}>
            Test Content
          </div>
        </Accordion>
      );
    });

    it('is closed by default', () => {
      expect(accordion.isOpen).to.be.false;
      expect(accordion.contentHeight).to.equal(0);
    });

    describe('clicking the header', () => {
      beforeEach(async () => {
        await accordion.clickHeader();
      });

      it('opens the accordion', () => {
        expect(accordion.isOpen).to.be.true;
        expect(accordion.contentHeight).to.equal(100);
      });

      describe('clicking the header again', () => {
        beforeEach(async () => {
          await accordion.clickHeader();
        });

        it('closes the accordion', () => {
          expect(accordion.isOpen).to.be.false;
          expect(accordion.contentHeight).to.equal(0);
        });
      });
    });
  });

  describe('with an id', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Accordion label="test" id="accordion-test">
          <div style={{ height: 100 }} />
        </Accordion>
      );
    });

    it('has an id on the root element', () => {
      expect(accordion.$root.id).to.equal('accordion-test');
    });

    it('is open by default', () => {
      expect(accordion.isOpen).to.be.true;
      expect(accordion.contentHeight).to.equal(100);
    });
  });

  describe('with a content id', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Accordion label="test" contentId="content-test">
          <div style={{ height: 100 }} />
        </Accordion>
      );
    });

    it('has an id on the accordion-wrapper element', () => {
      expect(accordion.id).to.equal('content-test');
    });
  });

  describe('without a content id', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Accordion label="test">
          <div style={{ height: 100 }} />
        </Accordion>
      );
    });

    it('creates an id on the accordion-wrapper element', () => {
      expect(accordion.id).to.match(/accordion[0-9]+/);
    });
  });

  describe('as part of an AccordionSet', () => {
    const accordionSet = new AccordionSetInteractor();

    beforeEach(async () => {
      await mountWithContext(
        <AccordionSet id="testSet">
          <Accordion label="test">
            <input />
          </Accordion>
          <Accordion label="test">
            <input />
          </Accordion>
          <Accordion label="test">
            <input />
          </Accordion>
          <Accordion label="test">
            <input />
          </Accordion>
        </AccordionSet>
      );
    });

    it('renders a div[role="tablist"]', () => {
      expect(accordionSet.tablist).to.be.true;
    });

    it('renders the supplied id prop', () => {
      expect(accordionSet.id).to.equal('testSet');
    });

    describe('keyboard navigation: next accordion', () => {
      beforeEach(async () => {
        await accordionSet.set(0).accordions.focusTrigger();
        await accordionSet.set(0).accordions.gotoNext();
      });

      it('second accordion is in focus', () => {
        expect(accordionSet.set(1).accordions.isFocused).to.be.true;
      });
    });

    describe('keyboard navigation: previous accordion', () => {
      beforeEach(async () => {
        await accordionSet.set(1).accordions.focusTrigger();
        await accordionSet.set(1).accordions.gotoPrevious();
      });

      it('first accordion is in focus', () => {
        expect(accordionSet.set(0).accordions.isFocused).to.be.true;
      });
    });

    describe('keyboard navigation: last accordion', () => {
      beforeEach(async () => {
        await accordionSet.set(0).accordions.focusTrigger();
        await accordionSet.set(0).accordions.gotoLast();
      });

      it('Last accordion is in focus', () => {
        expect(accordionSet.set(3).accordions.isFocused).to.be.true;
      });
    });

    describe('keyboard navigation: first accordion', () => {
      beforeEach(async () => {
        await accordionSet.set(3).accordions.focusTrigger();
        await accordionSet.set(3).accordions.gotoFirst();
      });

      it('First accordion is in focus', () => {
        expect(accordionSet.set(0).accordions.isFocused).to.be.true;
      });
    });
  });
});
