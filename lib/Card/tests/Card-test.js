import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { Card as CardInteractor, cardStyles, HTML, including } from '@folio/stripes-testing';
import { mountWithContext, mount } from '../../../tests/helpers';

import Card from '../Card';

const cardHeaderInteractor = HTML.extend('card header')
  .selector('[data-test-card-header');

const cardBodyInteractor = HTML.extend('card body')
  .selector('[data-test-card-body]');

const props = {
  headerStart: 'Header',
  headerEnd: 'End',
  body: 'Test Body',
};

describe('Card', () => {
  const card = CardInteractor(props.body);

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
      cardHeaderInteractor().exists();
    });

    it('renders headerStart according to prop', () => {
      card.has({ headerStart: props.headerStart });
    });

    it('renders headerEnd according to prop', () => {
      card.has({ headerEnd: props.headerEnd });
    });

    it('renders a body', () => {
      cardBodyInteractor().exists();
    });

    it('renders default style', () => {
      card.has({ style: cardStyles.default });
    });

    describe('when passed a cardStyle of "positive"', () => {
      const pCard = CardInteractor('Test');

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
        pCard.has({ style: cardStyles.positive });
      });
    });

    describe('when passed a cardStyle of "negative"', () => {
      const nCard = CardInteractor('Test');

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
        nCard.has({ style: cardStyles.negative });
      });
    });

    describe('when passed the marginBottom0 prop', () => {
      beforeEach(async () => {
        await mount(
          <Card
            id="testCard"
            headerStart="Card"
            marginBottom0
          >
            Test
          </Card>
        );
      });

      it('should have the "marginBottom0" class', () => {
        HTML('testCard').has({ className: including('marginBottom0') });
      });
    });

    describe('when passed the roundedBorder prop', () => {
      beforeEach(async () => {
        await mount(
          <Card
            id="testCard"
            headerStart="Card"
            roundedBorder
          >
            Test
          </Card>
        );
      });

      it('should have the "roundedBorder" class', () => {
        HTML('testCard').has({ className: including('roundedBorder') });
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
        HTML('testCard').has({ className: including('test-card') });
      });

      it('should have the test-header class on the header', () => {
        cardHeaderInteractor().has({ className: including('test-header') });
      });

      it('should have the test-body class on the body', () => {
        cardBodyInteractor().has({ className: including('test-body') });
      });
    });
  });
});
