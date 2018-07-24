/**
 * IconWithText tests
 */

import React from 'react';

import { it, describe, beforeEach } from '@bigtest/mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import IconWithText from '../IconWithText';
import IconWithTextInteractor from './interactor';

describe.only('IconWithText', () => {
  const iconWithText = new IconWithTextInteractor();
  const text = 'Hello World';
  const id = 'my-test-id';
  const standardIcon = 'closeX';

  beforeEach(async () => {
    await mount(
      <IconWithText
        text={text}
        icon={standardIcon}
        id={id}
      />
    );
  });

  /**
   * Icon and default tests
   */
  it(`Renders with an ID of "${id}"`, () => {
    expect(iconWithText.id).to.equal(id);
  });

  it(`Renders with a text of "${text}"`, () => {
    expect(iconWithText.text).to.equal(text);
  });

  it('Renders an <Icon /> if a valid icon string is passed to the "icon"-prop', () => {
    expect(iconWithText.regularIcon.isPresent).to.be.true;
  });

  /**
   * App Icon
   */
  describe('Passing a string to both the "app"-prop', () => {
    beforeEach(async () => {
      await mount(
        <IconWithText
          text={text}
          app="users"
          padding="end"
        />
      );
    });

    it('Renders an <AppIcon />', () => {
      expect(iconWithText.appIcon.isPresent).to.be.true;
    });
  });

  /**
   * Padding
   */
  describe('When passing a string to the padding-prop', () => {
    it('Renders with a classname of "padding-start" when padding="start"', () => {
      mount(
        <IconWithText
          padding="start"
        />
      );
      expect(iconWithText.hasPaddingStartClass).to.be.true;
    });

    it('Renders with a classname of "padding-end" when padding="end"', () => {
      mount(
        <IconWithText
          padding="end"
        />
      );
      expect(iconWithText.hasPaddingEndClass).to.be.true;
    });

    it('Renders with a classname of "padding-both" when padding="both"', () => {
      mount(
        <IconWithText
          padding="both"
        />
      );
      expect(iconWithText.hasPaddingBothClass).to.be.true;
    });
  });
});
