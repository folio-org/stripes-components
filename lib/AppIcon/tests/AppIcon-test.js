/**
 * AppIcon tests
 */

import React from 'react';

import { beforeEach, it, describe } from '@bigtest/mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import AppIcon from '../AppIcon';
import AppIconInteractor from './interactor';
import src from '../stories/app_icon_large.png';

describe.only('AppIcon', () => {
  const appIcon = new AppIconInteractor();
  const title = 'My title';
  const alt = 'My alt';
  const label = 'My label';
  const tag = 'div';
  const className = 'My className';

  const iconObject = {
    src,
    alt,
    title,
  };

  const iconSizes = {
    small: 14,
    medium: 24,
    large: 48,
  };

  describe('Rendering an AppIcon', () => {
    beforeEach(async () => {
      await mount(
        <AppIcon
          icon={iconObject}
          className={className}
        />
      );
    });

    it('Should render an <img>', () => {
      expect(appIcon.hasImg).to.be.true;
    });

    it('Should render an img with a title-attribute', () => {
      expect(appIcon.img.title).to.equal(title);
    });

    it('Should render an img with an alt-attribute', () => {
      expect(appIcon.img.alt).to.equal(alt);
    });

    it(`Should render with a className of "${className}"`, () => {
      expect(appIcon.className).to.include(className);
    });
  });

  describe('Passing a string using the children-prop', () => {
    beforeEach(async () => {
      await mount(
        <AppIcon>
          {label}
        </AppIcon>
      );
    });

    it('Should render an AppIcon with a label', () => {
      expect(appIcon.label).to.equal(label);
    });
  });

  describe('Passing a string to the tag-prop', () => {
    beforeEach(async () => {
      await mount(
        <AppIcon
          tag={tag}
          icon={iconObject}
        />
      );
    });

    it(`Should render an AppIcon with a HTML tag of "${tag}"`, () => {
      expect(appIcon.tag.toLowerCase()).to.equal(tag);
    });
  });


  Object.keys(iconSizes).forEach(size => {
    describe(`Passing a size of "${size}"`, () => {
      beforeEach(async () => {
        await mount(
          <AppIcon
            icon={iconObject}
            size={size}
          />
        );
      });
      it(`Should render an icon with a width of ${iconSizes[size]}px`, () => {
        expect(appIcon.img.offsetWidth).to.equal(iconSizes[size]);
      });
      it(`Should render an icon with a height of ${iconSizes[size]}px`, () => {
        expect(appIcon.img.offsetHeight).to.equal(iconSizes[size]);
      });
    });
  });
});
