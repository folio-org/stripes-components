import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import PaneFooterInteractor from './interactor';
import { mount } from '../../../tests/helpers';

import Button from '../../Button';
import PaneFooter from '../PaneFooter';

describe('PaneFooter', () => {
  const paneFooter = new PaneFooterInteractor();
  const primaryButtonLabel = 'Primary Button';
  const primaryButtonId = 'paneFooterPrimaryButton';
  const primaryButtonStyle = 'primary mega';
  const secondaryButtonLabel = 'Secondary Button';
  const secondaryButtonId = 'paneFooterSecondaryButton';
  const secondaryButtonStyle = 'default mega';

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

  it('renders a primary button', () => {
    expect(paneFooter.primaryButton.rendersPrimary).to.be.true;
  });

  it('primary button is disabled', () => {
    expect(paneFooter.primaryButtonDisabled).to.be.true;
  });

  it(`renders a button with id "${primaryButtonId}"`, () => {
    expect(paneFooter.primaryButton.id).to.equal(primaryButtonId);
  });

  it(`renders a button with a label of "${primaryButtonLabel}"`, () => {
    expect(paneFooter.primaryButton.label).to.equal(primaryButtonLabel);
  });

  it('renders a default button', () => {
    expect(paneFooter.secondaryButton.rendersDefault).to.be.true;
  });

  it(`renders a button with id "${secondaryButtonId}"`, () => {
    expect(paneFooter.secondaryButton.id).to.equal(secondaryButtonId);
  });

  it(`renders a button with a label of "${secondaryButtonLabel}"`, () => {
    expect(paneFooter.secondaryButton.label).to.equal(secondaryButtonLabel);
  });

  describe('renders a primary button', () => {
    beforeEach(
      renderPaneFooter({ primaryButtonDisabled: false })
    );

    it('primary button is not disabled', () => {
      expect(paneFooter.primaryButtonDisabled).to.be.false;
    });
  });
});
