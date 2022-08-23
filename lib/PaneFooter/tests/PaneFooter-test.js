import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';
import { runAxeTest, Button as ButtonInteractor, including } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

import Button from '../../Button';
import PaneFooter from '../PaneFooter';

describe('PaneFooter', () => {
  const primaryButton = ButtonInteractor({ className: including('primary') });
  const secondaryButton = ButtonInteractor({ className: including('default') });
  const primaryButtonLabel = 'Primary Button';
  const primaryButtonId = 'paneFooterPrimaryButton';
  const primaryButtonStyle = 'primary mega';
  const secondaryButtonLabel = 'Secondary Button';
  const secondaryButtonId = 'paneFooterSecondaryButton';
  const secondaryButtonStyle = 'default mega';

  describe('rendering PaneFooter', () => {
    const renderPaneFooter = ({ primaryButtonDisabled }) => async () => {
      await mount(
        <PaneFooter>
          <Button
            data-test-pane-footer-primary-button
            id={primaryButtonId}
            buttonStyle={primaryButtonStyle}
            disabled={primaryButtonDisabled}
          >
            {primaryButtonLabel}
          </Button>
          <Button
            data-test-pane-footer-secondary-button
            id={secondaryButtonId}
            buttonStyle={secondaryButtonStyle}
          >
            {secondaryButtonLabel}
          </Button>
        </PaneFooter>
      );
    };

    beforeEach(
      renderPaneFooter({ primaryButtonDisabled: true })
    );

    it('should render a disabled primary button', () => primaryButton.is({ disabled: true }));

    it(`should render a button with id "${primaryButtonId}"`, () => primaryButton.has({ id: primaryButtonId, disabled: true }));

    it(`should render a button with a label of "${primaryButtonLabel}"`, () => primaryButton.has({ text: primaryButtonLabel, disabled: true }));

    it('should render a default button', () => secondaryButton.exists());

    it(`should render a button with id "${secondaryButtonId}"`, () => secondaryButton.has({ id: secondaryButtonId }));

    it(`should render a button with a label of "${secondaryButtonLabel}"`, () => secondaryButton.has({ text: secondaryButtonLabel }));

    it('contains no axe errors - PaneFooter', runAxeTest);

    describe('rendering a primary button', () => {
      beforeEach(
        renderPaneFooter({ primaryButtonDisabled: false })
      );

      it('should not disable the primary button', () => primaryButton.has({ disabled: false }));
    });
  });

  describe('rendering DefaultPaneFooter', () => {
    const renderStart = isDisabled => (
      <Button
        data-test-pane-footer-primary-button
        id={primaryButtonId}
        buttonStyle={primaryButtonStyle}
        disabled={isDisabled}
      >
        {primaryButtonLabel}
      </Button>
    );

    const renderEnd = (
      <Button
        data-test-pane-footer-secondary-button
        id={secondaryButtonId}
        buttonStyle={secondaryButtonStyle}
      >
        {secondaryButtonLabel}
      </Button>
    );

    const renderDefaultPaneFooter = ({ primaryButtonDisabled }) => async () => {
      await mount(
        <PaneFooter
          renderStart={renderStart(primaryButtonDisabled)}
          renderEnd={renderEnd}
        />
      );
    };

    beforeEach(
      renderDefaultPaneFooter({ primaryButtonDisabled: true })
    );

    it('should render a disabled primary button', () => primaryButton.is({ disabled: true }));

    it('should render a default button', () => secondaryButton.exists());

    describe('rendering a primary button', () => {
      beforeEach(
        renderDefaultPaneFooter({ primaryButtonDisabled: false })
      );

      it('should not disable the primary button', () => primaryButton.is({ disabled: false }));
    });
  });
});
