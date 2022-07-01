/**
 * Headline tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { runAxeTest, HTML, including } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import Headline from '../Headline';

const sizes = ['small', 'medium', 'large', 'x-large', 'xx-large'];

const HeadlineInteractor = HTML.extend('headline')
  .selector('[data-test-headline]')
  .filters({
    class: (el) => el.className,
    tagName: (el) => el.tagName
  });

describe('Headline', () => {
  const headline = HeadlineInteractor();

  beforeEach(async () => {
    await mount(
      <Headline
        flex
        block
        faded
        tag="h1"
        className="my-custom-class"
      >
        My label
      </Headline>
    );
  });

  it('renders passed children', () => HeadlineInteractor('My label').exists());

  it('has a custom class name', () => headline.has({ class: including('my-custom-class') }));

  it('has faded text color class', () => headline.has({ class: including('isFaded') }));

  it('has display flex class', () => headline.has({ class: including('flex') }));

  it('has display block class', () => headline.has({ class: including('block') }));

  it('has a custom tag name of "h1"', () => headline.has({ tagName: 'H1' }));

  it('has no axe errors', runAxeTest);
  /**
   * Sizes
   */
  sizes.forEach(size => {
    describe(`when setting the "size"-prop to "${size}" and not setting the "margin"-prop`, () => {
      beforeEach(async () => {
        await mount(
          <Headline
            size={size}
          >
            My label
          </Headline>
        );
      });

      it(`has a size of ${size}`, () => headline.has({ class: including(`size-${size}`) }));

      it(`has a margin that matches the size (${size})`, () => headline.has({ class: including(`margin-${size}`) }));
    });
  });

  /**
   * Custom margins
   */
  sizes.forEach(size => {
    describe(`when setting the "margin"-prop to "${size}" and the "size"-prop to medium`, () => {
      beforeEach(async () => {
        await mount(
          <Headline
            size="medium"
            margin={size}
          >
            My label
          </Headline>
        );
      });

      it(`has a margin of ${size}`, () => headline.has({ class: including(`margin-${size}`) }));
    });
  });

  /**
   * Font weights
   */

  describe('Setting weight="regular"', () => {
    beforeEach(async () => {
      await mount(<Headline weight="regular">My label</Headline>);
    });

    it('Should have a font weight regular class', () => headline.has({ class: including('font-weight-regular') }));
  });

  describe('Setting weight="medium"', () => {
    beforeEach(async () => {
      await mount(<Headline weight="medium">My label</Headline>);
    });

    it('Should have a font weight medium class', () => headline.has({ class: including('font-weight-medium') }));
  });

  describe('Setting weight="bold"', () => {
    beforeEach(async () => {
      await mount(<Headline weight="bold">My label</Headline>);
    });

    it('Should have a font weight bold class', () => headline.has({ class: including('font-weight-bold') }));
  });

  describe('Setting weight="black"', () => {
    beforeEach(async () => {
      await mount(<Headline weight="black">My label</Headline>);
    });

    it('Should have a font weight black class', () => headline.has({ class: including('font-weight-black') }));
  });
});
