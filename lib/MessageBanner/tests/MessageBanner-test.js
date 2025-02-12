/**
 * MessageBanner tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import {
  MessageBanner as Interactor,
  IconButton as IconButtonInteractor,
  MessageBannerTypes,
  HTML,
  including
} from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import MessageBanner from '../MessageBanner';
// import MessageBannerInteractor from './interactor';
import Harness from '../../../tests/Harness';
import enLocaleStrings from '../../../translations/stripes-components/en';

const IconInteractor = HTML.extend('icon')
  .selector('svg');

describe('MessageBanner', () => {
  const messageBanner = Interactor();
  const dismissButton = IconButtonInteractor();
  const icon = IconInteractor();

  beforeEach(async () => {
    await mount(
      <Harness>
        <MessageBanner
          element="span"
          className="my-class"
          icon={null}
          dismissButtonProps={{
            className: 'my-dismiss-button-class'
          }}
          marginTop0={true}
          dismissible
        >
          Test
        </MessageBanner>
      </Harness>
    );
  });

  // eslint-disable-next-line
  it(`Should have a dismiss button with aria-label of "${enLocaleStrings['MessageBanner.dismissButtonAriaLabel']}"`, () => {
    dismissButton.has({ ariaLabel: enLocaleStrings['MessageBanner.dismissButtonAriaLabel'] });
  });

  it('Spreads the object passed to the dismissButtonProps-prop onto the dissmiss button', () => {
    dismissButton.has({ className: including('my-dismiss-button-class') });
  });

  it('Should not have an icon if the icon-prop = null', () => {
    icon.exists();
  });

  it('Should have a dismiss button if the dismissble-prop is true', () => {
    dismissButton.exists();
  });

  it('Should have a custom class name if passed to the className prop', () => {
    messageBanner.has({ className: including('my-class') });
  });

  it('Should have the marginTop0 class if passed to the prop', () => {
    messageBanner.has({ className: including('marginTop0') });
  });

  it('Should have a root element of <span> if passed via. the element prop', () => {
    messageBanner.has({ tagName: 'SPAN' });
  });

  it('Should render the content passed via. children', () => {
    messageBanner.has({ text: including('Test') });
  });

  it('Should have a the default style if no type is defined', () => {
    messageBanner.has({ type: MessageBannerTypes.default });
  });

  describe('Dismissing the message banner', () => {
    beforeEach(async () => {
      await messageBanner.dismiss();
    });

    it('Should disappear when the dismiss button is clicked', () => {
      messageBanner.is({ visible: false });
    });
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
      messageBanner.has({ type: MessageBannerTypes.success });
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
      messageBanner.has({ type: MessageBannerTypes.warning });
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
      messageBanner.has({ type: MessageBannerTypes.error });
    });
  });

  describe('If a custom dismiss button aria-label is passed to the dismissButtonAriaLabel-prop', () => {
    beforeEach(async () => {
      await mount(
        <Harness>
          <MessageBanner dismissButtonAriaLabel="Close me" dismissable>
            Test
          </MessageBanner>
        </Harness>
      );
    });

    it('Should use the passed aria-label instead of the default', () => {
      dismissButton.has({ ariaLabel: 'Close me' });
    });
  });

  describe('If the "autoFocusDismissButton"-prop is set to true', () => {
    beforeEach(async () => {
      await mount(
        <Harness>
          <MessageBanner
            autoFocusDismissButton
            dismissable
          >
            Test
          </MessageBanner>
        </Harness>
      );
    });

    it('Should focus the dismiss button on enter', () => {
      dismissButton.is({ focused: true });
    });
  });
});
