/**
 * AppIcon tests
 */

import React from 'react';

import { beforeEach, it, describe } from '@bigtest/mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';

import AppIcon from '../AppIcon';
import AppIconInteractor from './interactor';
import png from '../stories/users-app-icon.png';
import svg from '../stories/users-app-icon.svg';

describe('AppIcon', () => {
  const appIcon = new AppIconInteractor();
  const alt = 'My alt';
  const label = 'My label';
  const tag = 'div';
  const className = 'My className';

  const iconObject = {
    src: png,
    alt,
  };

  const iconSizes = {
    small: 14,
    medium: 24,
    large: 48,
  };

  // This is a mock of the Stripes context that's available in an Folio app
  const stripesMock = {
    metadata: {
      users: {
        icons: {
          app: {
            alt: 'Create, view and manage users',
            src: svg,
            high: {
              src: svg,
            },
            low: {
              src: png,
            }
          }
        }
      }
    }
  };

  describe('Rendering an AppIcon using Stripes-context', () => {
    beforeEach(async () => {
      await mount(
        <AppIcon
          stripes={stripesMock}
          app="users"
          className={className}
        />
      );
    });

    it('Should render an <img>', () => {
      expect(appIcon.hasImg).to.be.true;
    });

    it('Should render an img with an alt-attribute', () => {
      expect(appIcon.img.alt).to.equal(stripesMock.metadata.users.icons.app.alt);
    });
  });

  describe('Rendering an AppIcon using an icon-object', () => {
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
