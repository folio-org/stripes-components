import React from 'react';
import { beforeEach, it, describe } from 'mocha';
import { expect } from 'chai';
import { Bigtest } from '@folio/stripes-testing';
import { Interactor } from '@bigtest/interactor';

import { mount } from '../../../tests/helpers';

import DropdownMenu from '../DropdownMenu';

const HTML = Bigtest.HTML;

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

describe.only('DropdownMenu', () => {
  const dropdownMenu = HTML({ id: `${dropdownMenuId}` });

  describe('When opened', () => {
    beforeEach(async () => {
      await mountDropdownMenu({ open: true });
    });

    it('Than should be visible', () => dropdownMenu.exists());
  });

  describe('When closed', () => {
    beforeEach(async () => {
      await mountDropdownMenu({ open: false });
    });

    it('Than should not be visible', () => dropdownMenu.absent());
  });
});
