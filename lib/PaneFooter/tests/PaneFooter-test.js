import React from 'react';
import {
  describe,
  beforeEach,
  it,
} from 'mocha';
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

    it('should render a primary button', () => {
      expect(paneFooter.primaryButton.rendersPrimary).to.be.true;
    });

    it('should disable the primary button', () => {
      expect(paneFooter.primaryButtonDisabled).to.be.true;
    });

    it(`should render a button with id "${primaryButtonId}"`, () => {
      expect(paneFooter.primaryButton.id).to.equal(primaryButtonId);
    });

    it(`should render a button with a label of "${primaryButtonLabel}"`, () => {
      expect(paneFooter.primaryButton.label).to.equal(primaryButtonLabel);
    });

    it('should render a default button', () => {
      expect(paneFooter.secondaryButton.rendersDefault).to.be.true;
    });

    it(`should render a button with id "${secondaryButtonId}"`, () => {
      expect(paneFooter.secondaryButton.id).to.equal(secondaryButtonId);
    });

    it(`should render a button with a label of "${secondaryButtonLabel}"`, () => {
      expect(paneFooter.secondaryButton.label).to.equal(secondaryButtonLabel);
    });

    describe('rendering a primary button', () => {
      beforeEach(
        renderPaneFooter({ primaryButtonDisabled: false })
      );

      it('should not disable the primary button', () => {
        expect(paneFooter.primaryButtonDisabled).to.be.false;
      });
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

    it('should render a primary button', () => {
      expect(paneFooter.primaryButton.rendersPrimary).to.be.true;
    });

    it('should disable the primary button', () => {
      expect(paneFooter.primaryButtonDisabled).to.be.true;
    });

    it('should render a default button', () => {
      expect(paneFooter.secondaryButton.rendersDefault).to.be.true;
    });

    describe('rendering a primary button', () => {
      beforeEach(
        renderDefaultPaneFooter({ primaryButtonDisabled: false })
      );

      it('should not disable the primary button', () => {
        expect(paneFooter.primaryButtonDisabled).to.be.false;
      });
    });
  });
});
