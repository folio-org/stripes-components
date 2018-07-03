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
  const standardIcon = 'closeX';

  beforeEach(async () => {
    await mount(
      <IconWithText
        text={text}
        icon={standardIcon}
      />
    );
  });

  it(`Should render with a text of "${text}"`, () => {
    expect(iconWithText.text).to.equal(text);
  });
});
