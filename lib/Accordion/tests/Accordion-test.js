import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mount } from '../../../tests/helpers';

import Accordion from '../Accordion';
import AccordionInteractor from './interactor';

describe('Accordion', () => {
  let accordion = new AccordionInteractor();

  beforeEach(async () => {
    await mount(
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
      await mount(
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
      await mount(
        <Accordion label="test" id="accordion-test">
          <div style={{ height: 100 }}/>
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
});
