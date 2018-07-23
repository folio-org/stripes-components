/**
 * IconWithText tests
 */

import React from 'react';

import { it, describe, beforeEach } from '@bigtest/mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import IconWithText from '../IconWithText';
import IconWithTextInteractor from './interactor';

describe('IconWithText', () => {
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
  it(`Should render with an ID of "${id}"`, () => {
    expect(iconWithText.id).to.equal(id);
  });
  
  it(`Should render with a text of "${text}"`, () => {
    expect(iconWithText.text).to.equal(text);
  });

  it('Should render an <Icon /> if a valid icon string is passed to the "icon"-prop', () => {
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
        />
      );
    });

    it('Should render an <AppIcon />', () => {
      expect(iconWithText.appIcon.isPresent).to.be.true;
    });
  });
});
