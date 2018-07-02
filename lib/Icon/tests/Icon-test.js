/**
 * Icon tests
 */

import React from 'react';

import { beforeEach, it, describe } from '@bigtest/mocha';
import { expect } from 'chai';
import { mount } from '../../../tests/helpers';
import IconInteractor from './interactor';

import icons from '../icons';
import css from '../Icon.css';
import Icon from '../Icon';

describe('Icon', () => {
  const icon = new IconInteractor();
  const iconClassName = 'my-icon-test';

  const sizes = {
    small: {
      width: 16,
      height: 16,
    },
    medium: {
      width: 24,
      height: 24,
    },
    large: {
      width: 28,
      height: 28,
    }
  };

  /**
   * Testing icon rendered without passing an icon-prop
   */
  describe('When no icon is passed to the "icon"-prop', () => {
    beforeEach(async () => {
      await mount(<Icon />);
    });

    it('It should render the default icon', () => {
      expect(icon.svg.className).to.include('default');
    });
  });

  /**
   * Testing icon sizes
   */
  Object.keys(sizes).forEach(size => {
    describe(`When passing a string of "${size}" using the "size"-prop`, () => {
      const sizeClassName = css[size];
      beforeEach(async () => {
        await mount(<Icon icon="clearX" size={size} />);
      });

      it(`It should render an icon with a className of "${sizeClassName}"`, () => {
        expect(icon.className).to.include(sizeClassName);
      });

      it(`It should have a width of ${sizes[size].width}px`, () => {
        expect(sizes[size].width).to.equal(icon.width);
      });

      it(`It should have a height of ${sizes[size].height}px`, () => {
        expect(sizes[size].height).to.equal(icon.height);
      });
    });
  });

  /**
   * Testing that all icons are added correctly
   */
  // Note: Filtering out "spinner-ellipsis" since it's an atypical icon
  // that probably will be removed in the future in replacement of a loading component
  const testableIcons = Object.keys(icons).filter(key => ['spinner-ellipsis'].indexOf(key) < 0);

  testableIcons.forEach((key) => {
    describe(`When passing a string of "${key}" using the "icon"-prop`, () => {
      beforeEach(async () => {
        await mount(<Icon icon={key} iconClassName={iconClassName} />);
      });

      it('It should render a svg', () => {
        expect(icon.svg.isPresent).to.be.true;
      });

      it(`SVG should include a className of "${iconClassName}"`, () => {
        expect(icon.svg.className).to.include(iconClassName);
      });
    });
  });
});
