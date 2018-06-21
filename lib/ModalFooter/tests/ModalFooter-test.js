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
   * "primaryButton"-prop should render a primary <Button>
   */
  it(`renders a primary button with a label of "${primaryButtonLabel}" when using the primaryButton-prop`, () => {
    const button = modalFooter.$(`#${primaryButtonId}`);
    expect(button.className).to.include(buttonCss.primary);
    expect(button.innerText.trim()).to.equal(primaryButtonLabel);
  });

  /**
   * "secondaryButton"-prop should render a secondary <Button>
   */
  it(`renders a default button with a label of "${secondaryButtonLabel}" when using the secondaryButton-prop`, () => {
    const button = modalFooter.$(`#${secondaryButtonId}`);
    expect(button.className).to.include(buttonCss.default);
    expect(button.innerText.trim()).to.equal(secondaryButtonLabel);
  });
});
