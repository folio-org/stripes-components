import React from 'react';

import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { expect } from 'chai';

import DropdownButton from '../DropdownButton';
import DropdownButtonInteractor from './interactor';
import { mount } from '../../../tests/helpers';

const dropdownButtonInteractor = new DropdownButtonInteractor();

describe('DropdownButton', () => {
  describe('When the open prop is false', () => {
    beforeEach(async () => {
      await mount(
        <DropdownButton>
          <span data-test-button-content>Button</span>
        </DropdownButton>
      );
    });

    it('the icon should be pointing down', () => {
      expect(dropdownButtonInteractor.iconPointsDown).to.be.true;
    });

    it('button content should be shown', () => {
      expect(dropdownButtonInteractor.buttonContentIsShown).to.be.true;
    });
  });

  describe('When the open prop is true', () => {
    beforeEach(async () => {
      await mount(
        <DropdownButton open>
          <span data-test-button-content>Button</span>
        </DropdownButton>
      );
    });

    it('the icon should be pointing up', () => {
      expect(dropdownButtonInteractor.iconPointsUp).to.be.true;
    });

    it('button content should be shown', () => {
      expect(dropdownButtonInteractor.buttonContentIsShown).to.be.true;
    });
  });
});
