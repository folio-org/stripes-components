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

describe.only('Icon', () => {
  const icon = new IconInteractor();
  const iconClassName = 'icon-class';
  const iconRootClass = 'icon-root-class';
  const label = 'My Label';

  const sizes = {
    small: {
      width: 13,
      height: 13,
    },
    medium: {
      width: 16,
      height: 16,
    },
    large: {
      width: 18,
      height: 18,
    }
  };

  /**
   * General tests
   */
  describe('Rendering an icon', () => {
    beforeEach(async () => {
      await mount(
        <Icon
          id="icon-id"
          title="icon-title"
          icon="bookmark"
          iconClassName={iconClassName}
          iconRootClass={iconRootClass}
        />
      );
    });

    it('Renders an <svg> tag', () => {
      expect(icon.svg.isPresent).to.be.true;
    });

    it('Renders supplied title', () => {
      expect(icon.title).to.equal('icon-title');
    });

    it('Renders with default size medium', () => {
      expect(icon.isMedium).to.be.true;
    });

    it('Renders the supplied id on the root element', () => {
      expect(icon.id).to.equal('icon-id');
    });

    it('Renders the supplied classname on the root element', () => {
      expect(icon.className).to.include(iconRootClass);
    });

    it('Renders the supplied classname on the svg element', () => {
      expect(icon.svg.className).to.include(iconClassName);
    });
  });

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

      it(`It should render an SVG with a className of "${sizeClassName}"`, () => {
        expect(icon.svg.className).to.include(sizeClassName);
      });

      it(`It should have a width of ${sizes[size].width}px`, () => {
        // accept both the base and +1 to deal with browser pixel rounding discrepancies
        expect(icon.width).to.be.oneOf([sizes[size].width, sizes[size].width + 1]);
      });

      it(`It should have a height of ${sizes[size].height}px`, () => {
        // accept both the base and +1 to deal with browser pixel rounding discrepancies
        expect(icon.height).to.be.oneOf([sizes[size].height, sizes[size].height + 1]);
      });
    });
  });

  /**
   * Testing that all icons are added correctly
   */
  // Note: Filtering out "spinner-ellipsis" since it's an atypical icon
  // that probably will be removed in the future in replacement of a loading component
  const testableIcons = Object.keys(icons).filter(key => ['spinner-ellipsis'].indexOf(key) < 0);

  // testableIcons.forEach((key) => {
  //   describe(`When passing a string of "${key}" using the "icon"-prop`, () => {
  //     beforeEach(async () => {
  //       await mount(<Icon icon={key} iconClassName={iconClassName} />);
  //     });

  //     it('It should render a svg', () => {
  //       expect(icon.svg.isPresent).to.be.true;
  //     });

  //     it(`SVG should include a className of "${iconClassName}"`, () => {
  //       expect(icon.svg.className).to.include(iconClassName);
  //     });
  //   });
  // });

  /**
   * Testing icon rendered without passing an icon-prop
   */
  describe('When passing content using the children-prop', () => {
    beforeEach(async () => {
      await mount(
        <Icon>
          {label}
        </Icon>
      );
    });
    it(`Should render with a string of "${label}"`, () => {
      expect(icon.label).to.equal(label);
    });
  });
});
