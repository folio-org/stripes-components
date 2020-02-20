import React from 'react';

import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { mount } from '../../../tests/helpers';

import ModalFooter from '../ModalFooter';
import Button from '../../Button';
import ModalFooterInteractor from './interactor';

describe('ModalFooter', () => {
  const modalFooter = new ModalFooterInteractor();
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

    it('renders a primary button', () => {
      expect(modalFooter.primaryButton.rendersPrimary).to.be.true;
    });

    it('renders a default button', () => {
      expect(modalFooter.secondaryButton.rendersDefault).to.be.true;
    });

    it(`renders a button with a label of "${secondaryButtonLabel}"`, () => {
      expect(modalFooter.secondaryButton.label).to.equal(secondaryButtonLabel);
    });

    it(`renders a button with a label of "${primaryButtonLabel}"`, () => {
      expect(modalFooter.primaryButton.label).to.equal(primaryButtonLabel);
    });
  });
});
