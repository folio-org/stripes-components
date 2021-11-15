import React from 'react';
import { beforeEach, it, describe } from 'mocha';
import { expect } from 'chai';
import { Interactor } from '@bigtest/interactor';

import { mount } from '../../../tests/helpers';

import DropdownMenu from '../DropdownMenu';

const dropdownMenuId = 'dropdownMenu';
const mountDropdownMenu = ({ open }) => (
  mount(
    <DropdownMenu
      open={open}
      id="dropdownMenu"
    >
      <div>Select All</div>
    </DropdownMenu>
  )
);

describe('DropdownMenu', () => {
  const dropdownMenu = new Interactor(`#${dropdownMenuId}`);

  describe('When opened', () => {
    beforeEach(async () => {
      await mountDropdownMenu({ open: true });
    });

    it('Than should be visible', () => {
      expect(dropdownMenu.isVisible).to.be.true;
    });
  });

  describe('When closed', () => {
    beforeEach(async () => {
      await mountDropdownMenu({ open: false });
    });

    it('Than should not be visible', () => {
      expect(dropdownMenu.isVisible).to.be.false;
    });
  });
});
