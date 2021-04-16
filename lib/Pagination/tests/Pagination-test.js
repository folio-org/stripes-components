import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import Pagination from '../Pagination';

import { mountWithContext } from '../../../tests/helpers';
import PaginationInteractor from './interactor';

const clickHandler = sinon.spy();

describe('Pagination', () => {
  const pagination = new PaginationInteractor();

  describe('rendering', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Pagination
          pageCount={20}
          onPageChange={clickHandler}
          hrefBuilder={() => '#'}
        />
      );
    });

    it('should render pagination links', () => {
      expect(pagination.isPresent).to.be.true;
    });

    it('last number link should display 20', () => {
      expect(pagination.lastNumber.number).to.equal('20');
    });

    it('previous/next buttons display labels', () => {
      expect(pagination.nextlink.labelHidden).to.be.false;
      expect(pagination.nextlink.labelHidden).to.be.false;
    });

    describe('clicking the next button', () => {
      beforeEach(async () => {
        clickHandler.resetHistory;
        await pagination.nextlink.click();
      });

      it('calls the pageChange handler', () => {
        expect(clickHandler.calledOnce).to.be.true;
      });
    });
    describe('clicking the previous button', () => {
      beforeEach(async () => {
        clickHandler.resetHistory;
        await pagination.previouslink.click();
      });

      it('calls the pageChange handler', () => {
        expect(clickHandler.calledOnce).to.be.true;
      });
    });
  });

  describe('hidden previous/next labels', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Pagination
          pageCount={3}
          hrefBuilder={() => '#'}
          showLabels={false}
        />
      );
    });

    it('previous/next buttons hide labels', () => {
      expect(pagination.nextlink.labelHidden).to.be.true;
      expect(pagination.nextlink.labelHidden).to.be.true;
    });
  });
});
