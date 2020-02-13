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

describe('Card', () => {
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

    describe('when passed a cardStyle of "positive"', () => {
      beforeEach(async () => {
        await mount(
          <Card
            cardStyle="positive"
            headerStart="Card"
          >
            Test
          </Card>
        );
      });

      it('should have the "positive" class', () => {
        expect(card.rendersPositive).to.be.true;
      });
    });

    describe('when passed a cardStyle of "negative"', () => {
      beforeEach(async () => {
        await mount(
          <Card
            cardStyle="negative"
            headerStart="Card"
          >
            Test
          </Card>
        );
      });

      it('should have the "negative" class', () => {
        expect(card.rendersNegative).to.be.true;
      });
    });

    describe('when passed the marginBottom0 prop', () => {
      beforeEach(async () => {
        await mount(
          <Card
            headerStart="Card"
            marginBottom0
          >
            Test
          </Card>
        );
      });

      it('should have the "marginBottom0" class', () => {
        expect(card.rendersHasMarginBottom0).to.be.true;
      });
    });

    describe('when passed the roundedBorder prop', () => {
      beforeEach(async () => {
        await mount(
          <Card
            headerStart="Card"
            roundedBorder
          >
            Test
          </Card>
        );
      });

      it('should have the "roundedBorder" class', () => {
        expect(card.rendersRoundedBorder).to.be.true;
      });
    });

    describe('when passed *Class props', () => {
      beforeEach(async () => {
        await mount(
          <Card
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
