/**
 * Headline tests
 */

import React from 'react';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { runAxeTest } from '@folio/stripes-testing';
import { mount } from '../../../tests/helpers';
import Headline from '../Headline';
import HeadlineInteractor, { sizes } from './interactor';

describe('Headline', () => {
  const headline = new HeadlineInteractor();

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

  it('renders passed children', () => {
    expect(headline.label).to.equal('My label');
  });

  it('has a custom class name', () => {
    expect(headline.class).to.include('my-custom-class');
  });

  it('has faded text color class', () => {
    expect(headline.isFaded).to.be.true;
  });

  it('has display flex class', () => {
    expect(headline.isFlex).to.be.true;
  });

  it('has display block class', () => {
    expect(headline.isBlock).to.be.true;
  });

  it('has a custom tag name of "h1"', () => {
    expect(headline.tagName).to.equal('h1');
  });

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

      it(`has a size of ${size}`, () => {
        expect(headline[`has-size-${size}`]).to.be.true;
      });

      it(`has a margin that matches the size (${size})`, () => {
        expect(headline[`has-margin-${size}`]).to.be.true;
      });
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

      it(`has a margin of ${size}`, () => {
        expect(headline[`has-margin-${size}`]).to.be.true;
      });
    });
  });

  /**
   * Font weights
   */

  describe('Setting weight="regular"', () => {
    beforeEach(async () => {
      await mount(<Headline weight="regular">My label</Headline>);
    });

    it('Should have a font weight regular class', () => {
      expect(headline.hasRegularFontWeight).to.be.true;
    });
  });

  describe('Setting weight="medium"', () => {
    beforeEach(async () => {
      await mount(<Headline weight="medium">My label</Headline>);
    });

    it('Should have a font weight medium class', () => {
      expect(headline.hasMediumFontWeight).to.be.true;
    });
  });

  describe('Setting weight="bold"', () => {
    beforeEach(async () => {
      await mount(<Headline weight="bold">My label</Headline>);
    });

    it('Should have a font weight bold class', () => {
      expect(headline.hasBoldFontWeight).to.be.true;
    });
  });

  describe('Setting weight="black"', () => {
    beforeEach(async () => {
      await mount(<Headline weight="black">My label</Headline>);
    });

    it('Should have a font weight black class', () => {
      expect(headline.hasBlackFontWeight).to.be.true;
    });
  });
});
