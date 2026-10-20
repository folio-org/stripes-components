import React from 'react';

import { describe, beforeEach, it } from 'mocha';
import { Button as ButtonInteractor, including } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

import ModalFooter from '../ModalFooter';
import Button from '../../Button';

describe('ModalFooter', () => {
  const primaryButtonLabel = 'Primary Button';
  const primaryButtonId = 'modalFooterPrimaryButton';
  const secondaryButtonLabel = 'Secondary Button';
  const secondaryButtonId = 'modalFooterSecondaryButton';

  describe('when buttons are passed as children', () => {
    beforeEach(async () => {
      await mount(
        <ModalFooter>
          <Button id={primaryButtonId} buttonStyle="primary">
            {primaryButtonLabel}
          </Button>
          <Button id={secondaryButtonId}>
            {secondaryButtonLabel}
          </Button>
        </ModalFooter>
      );
    });

    it('renders a primary button', () => ButtonInteractor({ id: primaryButtonId, className: including('primary') }).exists());

    it('renders a default button', () => ButtonInteractor({ id: secondaryButtonId, className: including('default') }).exists());

    it(`renders a button with a label of "${secondaryButtonLabel}"`, () => ButtonInteractor({ id: secondaryButtonId, text: secondaryButtonLabel }).exists());

    it(`renders a button with a label of "${primaryButtonLabel}"`, () => ButtonInteractor({ id: primaryButtonId, text: primaryButtonLabel }).exists());
  });
});
