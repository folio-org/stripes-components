/**
 * Avatar tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { Avatar as Interactor, including } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

// import AvatarInteractor from './interactor';
import Avatar from '../Avatar';
import image from '../stories/dummy-profile-picture.jpg';

describe('Avatar', () => {
  const avatar = Interactor();
  const myClass = 'my-class';

  beforeEach(async () => {
    await mount(
      <Avatar
        src={image}
        className={myClass}
      />
    );
  });

  it('Should apply any custom class passed to the className-prop to the root element', () => {
    expect(avatar.has({ className: including(myClass) }));
  });

  it('Should render an <img> if an URL is passed to the src-prop', () => {
    expect(avatar.has({ image: true }));
  });

  describe('If no image is available', () => {
    beforeEach(async () => {
      await mount(
        <Avatar />
      );
    });

    it('Should render a svg placeholder', () => {
      expect(avatar.has({ placeholder: true }));
    });
  });
});
