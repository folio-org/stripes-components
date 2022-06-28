import React from 'react';

import {
  describe,
  beforeEach,
  it,
} from 'mocha';

import { Button, isVisible } from '@folio/stripes-testing';
import DropdownButton from '../DropdownButton';
import { mount } from '../../../tests/helpers';

const dropdownButtonInteractor = Button.extend('dropdown button')
  .filters({
    expanded: (el) => Array.from(el.querySelector('svg').classList).includes('icon-triangle-down'),
    childrenVisible: (el) => Array.from(el.childNodes).every((c) => isVisible(c))
  });

describe.only('DropdownButton', () => {
  const dd = dropdownButtonInteractor();
  describe('When the aria-expanded prop is false', () => {
    beforeEach(async () => {
      await mount(
        <DropdownButton>
          <span data-test-button-content>Button</span>
        </DropdownButton>
      );
    });

    it('the icon should be pointing down', () => dd.has({ expanded: true }));

    it('button content should be shown', () => dd.has({ childrenVisible: true }));
  });

  describe('When the aria-expanded prop is true', () => {
    beforeEach(async () => {
      await mount(
        <DropdownButton aria-expanded>
          <span data-test-button-content>Button</span>
        </DropdownButton>
      );
    });

    it('the icon should be pointing up', () => dd.has({ expanded: false }));

    it('button content should be shown', () => dd.has({ childrenVisible: true }));
  });
});
