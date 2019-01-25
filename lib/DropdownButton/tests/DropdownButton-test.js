import React from 'react';

import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { expect } from 'chai';

import DropdownButtonHarness from './DropdownButtonHarness';
import DropdownButtonInteractor from './interactor';
import { mount } from '../../../tests/helpers';

const dropdownButtonInteractor = new DropdownButtonInteractor();

describe('DropdownButton', () => {
  beforeEach(async () => {
    await mount(
      <DropdownButtonHarness />
    );
  });

  it('the dropdown content is hidden by default', () => {
    expect(dropdownButtonInteractor.contentIsShown).to.be.false;
  });

  it('the icon should be pointing down', () => {
    expect(dropdownButtonInteractor.iconPointsDown).to.be.true;
  });

  describe('then clicking the button', () => {
    beforeEach(async () => {
      await dropdownButtonInteractor.clickButton();
    });

    it('the dropdown content should be shown', () => {
      expect(dropdownButtonInteractor.contentIsShown).to.be.true;
    });

    it('the icon should be pointing up', () => {
      expect(dropdownButtonInteractor.iconPointsUp).to.be.true;
    });

    describe('then clicking the button again', () => {
      beforeEach(async () => {
        await dropdownButtonInteractor.clickButton();
      });

      it('the dropdown content should be hidden', () => {
        expect(dropdownButtonInteractor.contentIsShown).to.be.false;
      });

      it('the icon should be pointing down', () => {
        expect(dropdownButtonInteractor.iconPointsDown).to.be.true;
      });
    });
  });

  describe('when opening the dropdown', () => {
    beforeEach(async () => {
      await mount(
        <DropdownButtonHarness />
      );

      await dropdownButtonInteractor.clickButton();
    });

    describe('and then clicking outside of the dropdown content', () => {
      beforeEach(async () => {
        await dropdownButtonInteractor.clickOutsideOfDropdownContent();
      });

      it('the dropdown content should be hidden', () => {
        expect(dropdownButtonInteractor.contentIsShown).to.be.false;
      });
    });
  });
});
