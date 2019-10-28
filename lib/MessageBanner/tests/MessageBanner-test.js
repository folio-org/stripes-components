/**
 * MessageBanner tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';
import MessageBanner from '../MessageBanner';
import MessageBannerInteractor from './interactor';
import Harness from '../../../tests/Harness';

describe.only('MessageBanner', () => {
  const messageBanner = new MessageBannerInteractor();

  beforeEach(async () => {
    await mount(
      <Harness>
        <MessageBanner
          element="span"
          className="my-class"
          icon={null}
          dismissButtonAriaLabel="Close me"
          dismissButtonProps={{
            className: 'my-dismiss-button-class'
          }}
          dismissable
        >
          Test
        </MessageBanner>
      </Harness>
    );
    await messageBanner.dismissButton.click();
  });

  it('Should have a dismiss button with a custom aria-label of "Close me"', () => {
    expect(messageBanner.dismissButton.ariaLabel).to.equal('Close me');
  });

  it('Spreads the object passed to the dismissButtonProps-prop onto the dissmiss button', () => {
    expect(messageBanner.dismissButton.className).to.include('my-dismiss-button-class');
  });

  it('Should not have an icon if the icon-prop = null', () => {
    expect(messageBanner.icon.isPresent).to.be.false;
  });

  it('Should disappear when the dismiss button is clicked', () => {
    expect(messageBanner.isPresent).to.be.false;
  });

  it('Should have a dismiss button if the dismissble-prop is true', () => {
    expect(messageBanner.dismissButton.isPresent).to.be.true;
  });

  it('Should have a custom class name if passed to the className prop', () => {
    expect(messageBanner.className).to.include('my-class');
  });

  it('Should have a root element of <span> if passed via. the element prop', () => {
    expect(messageBanner.element).to.equal('SPAN');
  });

  it('Should render the content passed via. children', () => {
    expect(messageBanner.text).to.include('Test');
  });

  it('Should have a the default style if no type is defined', () => {
    expect(messageBanner.isDefault).to.be.true;
  });

  describe('If the type prop is set to success', () => {
    beforeEach(async () => {
      await mount(
        <MessageBanner type="success">
          Test
        </MessageBanner>
      );
    });
    it('Should have success style', () => {
      expect(messageBanner.isSuccess).to.be.true;
    });
  });

  describe('If the type prop is set to warning', () => {
    beforeEach(async () => {
      await mount(
        <MessageBanner type="warning">
          Test
        </MessageBanner>
      );
    });
    it('Should have warning style', () => {
      expect(messageBanner.isWarning).to.be.true;
    });
  });

  describe('If the type prop is set to error', () => {
    beforeEach(async () => {
      await mount(
        <MessageBanner type="error">
          Test
        </MessageBanner>
      );
    });
    it('Should have error style', () => {
      expect(messageBanner.isError).to.be.true;
    });
  });
});
