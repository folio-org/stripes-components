/**
 * Avatar tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { Avatar as Interactor, including, runAxeTest } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

// import AvatarInteractor from './interactor';
import Avatar from '../Avatar';
import image from '../stories/dummy-profile-picture.jpg';

describe('Avatar', () => {
  const avatar = Interactor();
  const avatarImg = Interactor(including('picture'));
  const myClass = 'my-class';

  beforeEach(async () => {
    await mount(
      <>
        <Avatar
          src={image}
          alt="test avatar alt text"
          className={myClass}
        />
      </>
    );
  });

  it('Should apply any custom class passed to the className-prop to the root element', async () => {
    await avatar.has({ className: including(myClass) });
  });

  it('Should render an <img> if an URL is passed to the src-prop', async () => {
    await avatarImg.exists();
  });

  it('has no axe errors', runAxeTest);

  describe('If no image is available', () => {
    beforeEach(async () => {
      await mount(
        <Avatar />
      );
    });

    it('Should render a svg placeholder', async () => {
      await avatar.has({ placeholder: true });
    });
  });
});
