import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext, mount } from '../../../tests/helpers';

import CardInteractor from './interactor';
import Card from '../Card';

const card = new CardInteractor();

const props = {
  headerStart: 'Header',
  headerEnd: 'End',
  body: 'Test Body',
};

describe.only('Card', () => {
  describe('rendering', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Card
          headerEnd={props.headerEnd}
          headerStart={props.headerStart}
        >
          {props.body}
        </Card>
      );
    });

    it('renders a header', () => {
      expect(card.isHeaderPresent).to.be.true;
    });

    it('renders headerStart according to prop', () => {
      expect(card.headerStart).to.equal(props.headerStart);
    });

    it('renders headerEnd according to prop', () => {
      expect(card.headerStart).to.equal(props.headerStart);
    });

    it('renders a body', () => {
      expect(card.isBodyPresent).to.be.true;
    });

    it('renders body according to children', () => {
      expect(card.body).to.equal(props.body);
    });

    it('renders default style', () => {
      expect(card.rendersDefault).to.be.true;
    });

    describe('when passed a cardStyle of lookupEmpty', () => {
      beforeEach(async () => {
        await mount(
          <Card
            cardStyle="lookupEmpty"
            headerStart="Card"
          >
            Test
          </Card>
        );
      });

      it('should have the lookupEmpty class', () => {
        expect(card.rendersLookupEmpty).to.be.true;
      });
    });

    describe('when passed a cardStyle of lookupPreview', () => {
      beforeEach(async () => {
        await mount(
          <Card
            cardStyle="lookupPreview"
            headerStart="Card"
          >
            Test
          </Card>
        );
      });

      it('should have the lookupPreview class', () => {
        expect(card.rendersLookupPreview).to.be.true;
      });
    });

    describe('when passed the bottomMargin0 prop', () => {
      beforeEach(async () => {
        await mount(
          <Card
            bottomMargin0
            cardStyle="lookupPreview"
            headerStart="Card"
          >
            Test
          </Card>
        );
      });

      it('should have the bottomMargin0 class', () => {
        expect(card.rendersBottomMargin0).to.be.true;
      });
    });

    describe('when passed *Class props', () => {
      beforeEach(async () => {
        await mount(
          <Card
            cardStyle="lookupPreview"
            headerStart="Card"
            cardClass="test-card"
            headerClass="test-header"
            bodyClass="test-body"
          >
            Test
          </Card>
        );
      });

      it('should have the test-card class on the card', () => {
        expect(card.cardHasTestClass).to.be.true;
      });

      it('should have the test-header class on the header', () => {
        expect(card.headerHasTestClass).to.be.true;
      });

      it('should have the test-body class on the body', () => {
        expect(card.bodyHasTestClass).to.be.true;
      });
    });
  });
});
