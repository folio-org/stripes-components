/**
 * ModalFooter test
 */

import React from 'react';

import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { mount } from '../../../tests/helpers';

import ModalFooter from '../ModalFooter';
import ModalFooterInteractor from './interactor';

describe('ModalFooter', () => {
  const modalFooter = new ModalFooterInteractor();
  const primaryButtonLabel = 'Primary Button';
  const primaryButtonId = 'modalFooterPrimaryButton';
  const secondaryButtonLabel = 'Secondary Button';
  const secondaryButtonId = 'modalFooterSecondaryButton';

  beforeEach(async () => {
    await mount(
      <ModalFooter
        primaryButton={{
          label: primaryButtonLabel,
          id: primaryButtonId,
        }}
        secondaryButton={{
          label: secondaryButtonLabel,
          id: secondaryButtonId,
        }}
      />
    );
  });

  /**
   * The "primaryButton"-prop should render a primary <Button>  with the primary button style
   */
  it('renders a primary button when using the primaryButton-prop', () => {
    expect(modalFooter.primaryButton.rendersPrimary).to.equal.true;
  });

  /**
   * The "secondaryButton"-prop should render a <Button> with the default button style
   */
  it('renders a default button when using the secondaryButton-prop', () => {
    expect(modalFooter.secondaryButton.rendersDefault).to.equal.true;
  });

  /**
   * Passing a label-key to either the secondaryButton- or primaryButton-prop
   * should render a button with the label value passed
   */
  it(`renders a button with a label of "${secondaryButtonLabel}"`, () => {
    expect(modalFooter.secondaryButton.label).to.equal(secondaryButtonLabel);
  });
  it(`renders a button with a label of "${primaryButtonLabel}"`, () => {
    expect(modalFooter.primaryButton.label).to.equal(primaryButtonLabel);
  });
});
