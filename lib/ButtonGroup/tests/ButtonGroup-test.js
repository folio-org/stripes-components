import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';

import Button from '../../Button';
import { mountWithContext } from '../../../tests/helpers';

import ButtonGroup from '../ButtonGroup';
import ButtonGroupInteractor from './interactor';

describe('ButtonGroup', () => {
  const buttonGroup = new ButtonGroupInteractor();

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
      expect(buttonGroup.tagName).to.equal('nav');
    });
  });
});
