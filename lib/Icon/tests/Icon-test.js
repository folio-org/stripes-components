/**
 * Icon tests
 */

import React from 'react';

import { beforeEach, it, describe } from 'mocha';
import { expect } from 'chai';
import { runAxeTest } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';
import IconInteractor from './interactor';

import icons from '../icons';
import css from '../Icon.css';
import spinnerCss from '../DotSpinner.css';
import Icon from '../Icon';

describe('Icon', () => {
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
          ariaLabel="icon-title"
          tabIndex="0"
          icon="bookmark"
          iconClassName={iconClassName}
          iconRootClass={iconRootClass}
        />
      );
    });

    it('Renders an <svg> tag', () => {
      expect(icon.iconElement.isPresent).to.be.true;
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
      expect(icon.iconElement.className).to.include(iconClassName);
    });

    it('has no axe errors', runAxeTest);
  });

  /**
   * Testing icon rendered without passing an icon-prop
   */
  describe('When no icon is passed to the "icon"-prop', () => {
    beforeEach(async () => {
      await mount(<Icon />);
    });

    it('It should render the default icon', () => {
      expect(icon.iconElement.className).to.include('default');
    });

    it('has no axe errors', runAxeTest);
  });

  /**
   * Testing the spinner-ellipsis icon
   */
  describe('When rendering the "spinner-ellipsis"-icon', () => {
    beforeEach(async () => {
      await mount(<Icon icon="spinner-ellipsis" />);
    });

    it('Should include a "iconSpinner" className', () => {
      expect(icon.iconElement.className).to.include(spinnerCss.spinner);
    });

    it('has no axe errors', runAxeTest);
  });

  /**
   * Testing icon sizes
   */
  Object.keys(sizes).forEach(size => {
    describe(`When passing a string of "${size}" using the "size"-prop`, () => {
      const sizeClassName = css[size];

      beforeEach(async () => {
        await mount(<Icon icon="times-circle-solid" size={size} />);
      });

      it(`Should render a SVG with a className of "${sizeClassName}"`, () => {
        expect(icon.iconElement.className).to.include(sizeClassName);
      });

      it(`Should have a width of ${sizes[size].width}px`, () => {
        // accept both the base and +1 to deal with browser pixel rounding discrepancies
        expect(icon.width).to.be.oneOf([sizes[size].width, sizes[size].width + 1]);
      });

      it(`Should have a height of ${sizes[size].height}px`, () => {
        // accept both the base and +1 to deal with browser pixel rounding discrepancies
        expect(icon.height).to.be.oneOf([sizes[size].height, sizes[size].height + 1]);
      });

      it('SVG should have a viewBox attribute with the value of "0 0 32 32"', () => {
        expect(icon.iconElement.viewBox).to.equal('0 0 32 32');
      });

      it('has no axe errors', runAxeTest);
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
        expect(icon.iconElement.isPresent).to.be.true;
      });

      it(`SVG should include a className of "${iconClassName}"`, () => {
        expect(icon.iconElement.className).to.include(iconClassName);
      });
    });
  });

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

    it('has no axe errors', runAxeTest);
  });

  /**
   * Testing icon styles
   */
  describe('When passing a string of "action" to the iconStyle-prop', () => {
    beforeEach(async () => {
      await mount(
        <Icon iconStyle="action" />
      );
    });
    it('Should render an action icon', () => {
      expect(icon.isActionIcon).to.be.true;
    });
  });

  /**
   * Custom icon
   */
  describe('When passing a custom icon function to the "icon"-prop', () => {
    beforeEach(async () => {
      const customIcon = ({ className, ...rest }) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={`my-custom-icon ${className}`} {...rest}>
          <path d="M19.9 2.4v10.4l9.7-5.2zM2.4 29.6l9.7-5.2-9.7-5.2zm17.5 0l9.7-5.2-9.7-5.2z" />
        </svg>
      );
      await mount(
        <Icon
          icon={customIcon}
        />
      );
    });

    it('Should render the custom icon', () => {
      expect(icon.iconElement.className).to.include('my-custom-icon');
    });

    it('SVG should have a viewBox attribute with the value of "0 0 32 32"', () => {
      expect(icon.iconElement.viewBox).to.equal('0 0 32 32');
    });
  });
});
