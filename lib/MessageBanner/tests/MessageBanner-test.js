/**
 * MessageBanner tests
 */

import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import camelCase from 'lodash/camelCase';
import { mount } from '../../../tests/helpers';
import MessageBanner, { TYPES } from '../MessageBanner';
import MessageBannerInteractor from './interactor';

describe('MessageBanner', () => {
  const messageBanner = new MessageBannerInteractor();

  beforeEach(async () => {
    await mount(
      <MessageBanner
        element="span"
        className="my-class"
        icon={null}
        dismissable
      >
        Test
      </MessageBanner>
    );
    await messageBanner.dismissButton.click();
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
