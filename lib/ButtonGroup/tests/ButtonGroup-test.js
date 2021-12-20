import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { ButtonGroup as Interactor, HTML } from '@folio/stripes-testing';
import Button from '../../Button';

import { mountWithContext } from '../../../tests/helpers';

import ButtonGroup from '../ButtonGroup';

const Nav = HTML.extend('nav element')
  .selector('nav');

describe('ButtonGroup', () => {
  const buttonGroup = Interactor();

  describe('tagName', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ButtonGroup tagName="nav">
          <Button> test </Button>
          <Button> test </Button>
        </ButtonGroup>
      );
    });

    it('sets HTML tag for button group', () => {
      Nav().exists();
    });

    it('renders contained number of child buttons', () => {
      buttonGroup.has({ buttonCount: 2 });
    });
  });
});
