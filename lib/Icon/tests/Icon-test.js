/**
 * Icon tests
 */

import React from 'react';

import { beforeEach, it, describe } from 'mocha';
import { runAxeTest, HTML, including } from '@folio/stripes-testing';

import { mount } from '../../../tests/helpers';

import icons from '../icons';
import css from '../Icon.css';
import spinnerCss from '../DotSpinner.css';
import Icon from '../Icon';

// custom bigtest matcher - we may need to move this to a utility file if they accumulate.

function oneOf(list) {
  return {
    match(actual) {
      return list.includes(actual);
    },
    description() {
      return `value includes an item from: ${list}`;
    }
  };
}

const IconInteractor = HTML.extend('icon')
  .selector('[class*=icon---]')
  .filters({
    class: (el) => el.className,
    label: (el) => el.textContent,
    svg: (el) => !!el.querySelector('svg'),
    width: (el) => el.offsetWidth,
    height: (el) => el.offsetHeight,
    viewBox: (el) => el.querySelector('svg')?.getAttribute('viewBox') || '',
    iconClass: (el) => {
      return el.querySelector('[data-test-icon-element]') ?
        el.querySelector('[data-test-icon-element]').getAttribute('class') :
        el.querySelector('svg').getAttribute('class') || '';
    },
    iconRendered: (el) => !!el.querySelector('[data-test-icon-element]')
  });


describe('Icon', () => {
  const icon = IconInteractor();
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
          tabIndex="0"
          icon="bookmark"
          iconClassName={iconClassName}
          iconRootClass={iconRootClass}
        />
      );
    });

    it('Renders an <svg> tag', () => icon.has({ iconRendered: true }));

    it('Renders with default size medium', () => icon.has({ iconClass: including('medium') }));

    it('Renders the supplied id on the root element', () => icon.has({ id: 'icon-id' }));

    it('Renders the supplied classname on the root element', () => icon.has({ class: including(iconRootClass) }));

    it('Renders the supplied classname on the svg element', () => icon.has({ iconClass: including(iconClassName) }));

    it('has no axe errors', runAxeTest);
  });

  /**
   * Testing icon rendered without passing an icon-prop
   */
  describe('When no icon is passed to the "icon"-prop', () => {
    beforeEach(async () => {
      await mount(<Icon />);
    });

    it('It should render the default icon', () => icon.has({ iconClass: including('default') }));

    it('has no axe errors', runAxeTest);
  });

  /**
   * Testing the spinner-ellipsis icon
   */
  describe('When rendering the "spinner-ellipsis"-icon', () => {
    beforeEach(async () => {
      await mount(<Icon icon="spinner-ellipsis" />);
    });

    it('Should include a "iconSpinner" className', () => icon.has({ iconClass: including(spinnerCss.spinner) }));

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

      it(`Should render a SVG with a className of "${sizeClassName}"`, () => icon.has({ iconClass: including(sizeClassName) }));

      it(`Should have a width of ${sizes[size].width}px`, () => icon.has({ width: oneOf([sizes[size].width, sizes[size].width + 1]) }));

      it(`Should have a height of ${sizes[size].height}px`, () => icon.has({ height: oneOf([sizes[size].height, sizes[size].height + 1]) }));

      it('SVG should have a viewBox attribute with the value of "0 0 32 32"', () => icon.has({ viewBox: '0 0 32 32' }));

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

      it('It should render a svg', () => icon.has({ svg: true }));

      it(`SVG should include a className of "${iconClassName}"`, () => icon.has({ iconClass: including(iconClassName) }));
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
    it(`Should render with a string of "${label}"`, () => icon.has({ label }));

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
    it('Should render an action icon', () => icon.has({ class: including('action') }));
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

    it('Should render the custom icon', () => icon.has({ iconClass: including('my-custom-icon') }));

    it('SVG should have a viewBox attribute with the value of "0 0 32 32"', () => icon.has({ viewBox: '0 0 32 32' }));
  });
});
