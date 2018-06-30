/**
 * ModalFooter test
 */

import React from 'react';

import { expect } from 'chai';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { mount } from '../../../tests/helpers';

import ModalFooter from '../ModalFooter';
import ModalFooterInteractor from './interactor';

import buttonCss from '../../Button/Button.css';

describe('ModalFooter', () => {
  const modalFooter = new ModalFooterInteractor();
  const primaryButtonId = 'primaryButton';
  const primaryButtonLabel = 'Primary Button';
  const secondaryButtonId = 'secondaryButton';
  const secondaryButtonLabel = 'Secondary Button';

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
    const button = modalFooter.$(`#${primaryButtonId}`);
    expect(button.className).to.include(buttonCss.primary);
  });

  /**
   * The "secondaryButton"-prop should render a <Button> with the default button style
   */
  it('renders a default button when using the secondaryButton-prop', () => {
    const button = modalFooter.$(`#${secondaryButtonId}`);
    expect(button.className).to.include(buttonCss.default);
  });

  /**
   * Passing a label-key to either secondaryButton or primaryButton
   * should render a button with this label
   */
  it('renders the label when passing a label-key to any of the button props', () => {
    const button = modalFooter.$(`#${secondaryButtonId}`);
    expect(button.innerText.trim()).to.equal(secondaryButtonLabel);
  });
});
